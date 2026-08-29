import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AuthModule } from './modules/auth/auth.module';
import { DonationModule } from './modules/donation/donation.module';
import { TimeModule } from './modules/time/time.module';
import { PomodoroModule } from './modules/pomodoro/pomodoro.module';
import { PlannerModule } from './modules/planner/planner.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TimerModule } from './modules/timer/timer.module';
import { ProjectModule } from './modules/project/project.module';
import { ExportModule } from './modules/export/export.module';
import { TeamModule } from './modules/team/team.module';
import { EventsModule } from './modules/events/events.module';
import { VoiceModule } from './modules/voice/voice.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard, RolesGuard } from './common/guards/guards';
import { CustomThrottlerGuard } from './modules/throttle/custom-throttler.guard';
import { AdminModule } from './modules/admin/admin.module';
import { MetricsMiddleware } from './observability/metrics/metrics.middleware';
import { LoggingMiddleware } from './observability/logger/logging.middleware';
import { RequestContextMiddleware } from './observability/logger/request-context.middleware';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { HealthModule } from './health/health.module';
import { TracingModule } from './observability/tracing/tracing.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    TracingModule,
    AdminModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: 60_000,
          limit: 100,
        },
      ],
    }),
    UserModule,
    SubscriptionModule,
    AuthModule,
    DonationModule,
    TimeModule,
    PomodoroModule,
    PlannerModule,
    DashboardModule,
    TimerModule,
    ProjectModule,
    ExportModule,
    TeamModule,
    EventsModule,
    VoiceModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware, LoggingMiddleware, MetricsMiddleware)
      .forRoutes('*');
  }
}

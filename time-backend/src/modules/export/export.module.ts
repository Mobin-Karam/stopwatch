import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { PlannerModule } from '../planner/planner.module';
import { PomodoroModule } from '../pomodoro/pomodoro.module';
import { TimerModule } from '../timer/timer.module';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PlannerModule,
    PomodoroModule,
    TimerModule,
    ProjectModule,
    UserModule,
  ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}

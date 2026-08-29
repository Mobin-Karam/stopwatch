import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { TimerLog, TimerLogSchema } from './schemas/timer-log.schema';
import { UserModule } from '../user/user.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    UserModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: TimerLog.name, schema: TimerLogSchema },
    ]),
  ],
  controllers: [TimerController],
  providers: [TimerService],
  exports: [TimerService],
})
export class TimerModule {}

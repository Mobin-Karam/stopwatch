import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PomodoroSession,
  PomodoroSessionSchema,
} from './schemas/pomodoro-session.schema';
import { PomodoroController } from './pomodoro.controller';
import { PomodoroService } from './pomodoro.service';
import { UserModule } from '../user/user.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    UserModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: PomodoroSession.name, schema: PomodoroSessionSchema },
    ]),
  ],
  controllers: [PomodoroController],
  providers: [PomodoroService],
  exports: [PomodoroService],
})
export class PomodoroModule {}

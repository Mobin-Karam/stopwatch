import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { PlannerModule } from '../planner/planner.module';
import { PomodoroModule } from '../pomodoro/pomodoro.module';
import { TimerModule } from '../timer/timer.module';
import {
  TeamMessage,
  TeamMessageSchema,
} from './schemas/team-message.schema';
import { TeamMessageService } from './team-message.service';
import { EventsModule } from '../events/events.module';
import { TeamRead, TeamReadSchema } from './schemas/team-read.schema';
import { TeamReadService } from './team-read.service';

@Module({
  imports: [
    UserModule,
    forwardRef(() => ProjectModule),
    PlannerModule,
    PomodoroModule,
    TimerModule,
    EventsModule,
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([
      { name: TeamMessage.name, schema: TeamMessageSchema },
      { name: TeamRead.name, schema: TeamReadSchema },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamMessageService, TeamReadService],
  exports: [TeamService, TeamMessageService, TeamReadService],
})
export class TeamModule {}

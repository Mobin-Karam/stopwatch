import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { UserModule } from '../user/user.module';
import { PlannerModule } from '../planner/planner.module';
import { PomodoroModule } from '../pomodoro/pomodoro.module';
import { TimerModule } from '../timer/timer.module';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [
    UserModule,
    PlannerModule,
    PomodoroModule,
    TimerModule,
    forwardRef(() => TeamModule),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

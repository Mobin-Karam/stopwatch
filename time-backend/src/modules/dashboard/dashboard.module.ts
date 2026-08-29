import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { PomodoroModule } from '../pomodoro/pomodoro.module';
import { PlannerModule } from '../planner/planner.module';
import { UserModule } from '../user/user.module';
import { TimerModule } from '../timer/timer.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [PomodoroModule, PlannerModule, UserModule, TimerModule, ProjectModule],
  controllers: [DashboardController],
})
export class DashboardModule {}

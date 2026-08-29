import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { UserService } from '../user/user.service';
import { PlannerService } from '../planner/planner.service';
import { PomodoroService } from '../pomodoro/pomodoro.service';
import { TimerService } from '../timer/timer.service';
import { TeamService } from '../team/team.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('projects')
@UseGuards(AuthenticatedGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly plannerService: PlannerService,
    private readonly pomodoroService: PomodoroService,
    private readonly timerService: TimerService,
    private readonly teamService: TeamService,
  ) {}

  private async ensureUser(req: any) {
    if (req.user) {
      if (!req.session?.userId) req.session.userId = req.user.id;
      return req.user;
    }
    if (!req.session?.userId) {
      throw new UnauthorizedException();
    }
    return this.userService.getUser(req.session.userId);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body('name') name: string,
    @Body('color') color?: string,
    @Body('teamId') teamId?: string,
  ) {
    const user = await this.ensureUser(req);
    if (teamId) {
      await this.teamService.getTeamForUser(teamId, user._id);
    }
    return this.projectService.create(user._id, name, color, teamId);
  }

  @Get()
  async list(@Req() req: any) {
    const user = await this.ensureUser(req);
    return this.projectService.listAccessible(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('color') color?: string,
    @Body('archived') archived?: boolean,
  ) {
    return this.projectService.update(id, { name, color, archived });
  }

  @Get(':id/summary')
  async summary(
    @Req() req: any,
    @Param('id') id: string,
    @Query('days') days?: string,
  ) {
    const user = await this.ensureUser(req);
    const project = await this.projectService.findAccessibleProject(user, id);
    if (project.teamId) {
      await this.teamService.getTeamForUser(project.teamId.toString(), user._id);
    }
    const parsedDays = days ? Number(days) : 7;
    const lookback = Number.isFinite(parsedDays) ? parsedDays : 7;

    const today = new Date().toISOString().slice(0, 10);

    const [pomodoro, plannerSummary, todayTasks, timerLogs] = await Promise.all(
      [
        this.pomodoroService.summary(user._id, lookback, project._id),
        this.plannerService.summary(user._id, lookback, project._id),
        this.plannerService.listTasks(user._id, today, project._id),
        this.timerService.recentLogs(user._id, 200, project._id),
      ],
    );

    const todayCounts = todayTasks.reduce(
      (acc, t: any) => {
        if (t.status === 'done') acc.done += 1;
        else if (t.status === 'pending') acc.pending += 1;
        acc.total += 1;
        return acc;
      },
      { done: 0, pending: 0, total: 0 },
    );

    const totalPomodoroMinutes = pomodoro.reduce(
      (sum: number, s: any) => sum + (s.totalFocusMinutes ?? 0),
      0,
    );

    return {
      project: {
        id: project._id.toString(),
        name: project.name,
        color: project.color,
      },
      rangeDays: lookback,
      pomodoro,
      planner: {
        summary: plannerSummary,
        today: todayCounts,
      },
      timers: {
        count: timerLogs.length,
      },
      totals: {
        focusMinutes: totalPomodoroMinutes,
        timerSessions: timerLogs.length,
      },
    };
  }
}

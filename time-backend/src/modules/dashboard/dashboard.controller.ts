import { Controller, Get, Query, Req } from '@nestjs/common';
import { PomodoroService } from '../pomodoro/pomodoro.service';
import { PlannerService } from '../planner/planner.service';
import { UserService } from '../user/user.service';
import { TimerService } from '../timer/timer.service';
import { ProjectService } from '../project/project.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('dashboard')
@UseGuards(AuthenticatedGuard)
export class DashboardController {
  constructor(
    private readonly pomodoroService: PomodoroService,
    private readonly plannerService: PlannerService,
    private readonly userService: UserService,
    private readonly timerService: TimerService,
    private readonly projectService: ProjectService,
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

  @Get('summary')
  async summary(
    @Req() req: any,
    @Query('days') days?: string,
    @Query('projectId') projectId?: string,
  ) {
    const user = await this.ensureUser(req);
    const userId = (user as any)?._id ?? (user as any)?.id;
    if (!userId) {
      return { rangeDays: 0, pomodoro: [], planner: { summary: [], today: { done: 0, pending: 0, total: 0 } } };
    }
    const parsedDays = days ? Number(days) : 7;
    const lookback = Number.isFinite(parsedDays) ? parsedDays : 7;

    const [pomodoro, plannerSummary, todayTasks, timerLogs, projects] =
      await Promise.all([
        this.pomodoroService.summary(userId, lookback),
        this.plannerService.summary(userId, lookback),
        this.plannerService.listTasks(
          userId,
          new Date().toISOString().slice(0, 10),
          projectId as any,
        ),
        this.timerService.recentLogs(userId, 200, projectId as any),
        this.projectService.list(userId),
      ]);

    const todayCounts = todayTasks.reduce(
      (acc, t: any) => {
        if (t.status === 'done') acc.done += 1;
        else if (t.status === 'pending') acc.pending += 1;
        acc.total += 1;
        return acc;
      },
      { done: 0, pending: 0, total: 0 },
    );

    const byProject = projects.map((p: any) => ({
      projectId: p._id.toString(),
      name: p.name,
      color: p.color,
      pomodoroMinutes: pomodoro
        .filter((s: any) => s.projectId?.toString() === p._id.toString())
        .reduce((sum: number, s: any) => sum + (s.totalFocusMinutes ?? 0), 0),
      tasks: todayTasks.filter(
        (t: any) => t.projectId?.toString() === p._id.toString(),
      ).length,
      timerSessions: timerLogs.filter(
        (l: any) => l.projectId?.toString() === p._id.toString(),
      ).length,
    }));

    const filteredProject = projectId
      ? byProject.find((p) => p.projectId === projectId)
      : null;

    const totalPomodoroMinutes = pomodoro.reduce(
      (sum: number, s: any) => sum + (s.totalFocusMinutes ?? 0),
      0,
    );
    const totalTimers = timerLogs.length;

    return {
      rangeDays: lookback,
      pomodoro,
      planner: {
        summary: plannerSummary,
        today: todayCounts,
      },
      timers: {
        count: totalTimers,
      },
      projects: byProject,
      project: filteredProject ?? undefined,
      totals: {
        focusMinutes: totalPomodoroMinutes,
        timerSessions: totalTimers,
      },
    };
  }
}

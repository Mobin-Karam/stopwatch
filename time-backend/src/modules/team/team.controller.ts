import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { PlannerService } from '../planner/planner.service';
import { PomodoroService } from '../pomodoro/pomodoro.service';
import { TimerService } from '../timer/timer.service';
import { TeamMessageService } from './team-message.service';
import { TeamReadService } from './team-read.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('teams')
@UseGuards(AuthenticatedGuard)
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly plannerService: PlannerService,
    private readonly pomodoroService: PomodoroService,
    private readonly timerService: TimerService,
    private readonly teamMessageService: TeamMessageService,
    private readonly teamReadService: TeamReadService,
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
  async create(@Req() req: any, @Body('name') name: string) {
    const user = await this.ensureUser(req);
    return this.teamService.createTeam(user, name);
  }

  @Get()
  async list(@Req() req: any) {
    const user = await this.ensureUser(req);
    return this.teamService.listTeams(user._id);
  }

  @Post(':id/members')
  async addMember(
    @Req() req: any,
    @Param('id') id: string,
    @Body('userId') userId?: string,
    @Body('email') email?: string,
  ) {
    const user = await this.ensureUser(req);
    return this.teamService.addMember({
      teamId: id,
      requester: user,
      memberUserId: userId,
      memberEmail: email,
    });
  }

  @Delete(':id/members/:memberId')
  async removeMember(
    @Req() req: any,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    const user = await this.ensureUser(req);
    return this.teamService.removeMember(id, user, memberId);
  }

  @Get(':id/summary')
  async summary(@Req() req: any, @Param('id') id: string) {
    const user = await this.ensureUser(req);
    const team = await this.teamService.getTeamForUser(id, user._id);

    const projects = await this.projectService.listByTeam(team._id);
    const today = new Date().toISOString().slice(0, 10);

    const perProject = await Promise.all(
      projects.map(async (p: any) => {
        const [plannerToday, pomodoroSummary, timers] = await Promise.all([
          this.plannerService.listTasks(user._id, today, p._id),
          this.pomodoroService.summary(user._id, 7, p._id),
          this.timerService.recentLogs(user._id, 200, p._id),
        ]);

        const todayCounts = plannerToday.reduce(
          (acc, t: any) => {
            if (t.status === 'done') acc.done += 1;
            else if (t.status === 'pending') acc.pending += 1;
            acc.total += 1;
            return acc;
          },
          { done: 0, pending: 0, total: 0 },
        );

        const focusMinutes = pomodoroSummary.reduce(
          (sum: number, s: any) => sum + (s.totalFocusMinutes ?? 0),
          0,
        );

        return {
          projectId: p._id.toString(),
          name: p.name,
          color: p.color,
          todayTasks: todayCounts,
          focusMinutes,
          timerSessions: timers.length,
        };
      }),
    );

    return {
      team: { id: team._id.toString(), name: team.name },
      projects: perProject,
    };
  }

  @Post(':id/messages')
  async postMessage(
    @Req() req: any,
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('projectId') projectId?: string,
  ) {
    const user = await this.ensureUser(req);
    return this.teamMessageService.postMessage({
      teamId: id,
      sender: user,
      content,
      projectId,
    });
  }

  @Get(':id/messages')
  async listMessages(
    @Req() req: any,
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('since') since?: string,
  ) {
    const user = await this.ensureUser(req);
    const parsed = limit ? Number(limit) : 50;
    return this.teamMessageService.listMessages(
      id,
      user,
      Number.isFinite(parsed) ? parsed : 50,
      since,
    );
  }

  @Post(':id/read')
  async markRead(
    @Req() req: any,
    @Param('id') id: string,
    @Body('timestamp') timestamp?: string,
  ) {
    const user = await this.ensureUser(req);
    const at = timestamp ? new Date(timestamp) : undefined;
    return this.teamReadService.markRead(id, user._id, at);
  }

  @Get(':id/unread')
  async unread(@Req() req: any, @Param('id') id: string) {
    const user = await this.ensureUser(req);
    return this.teamReadService.unreadCount(id, user._id);
  }
}

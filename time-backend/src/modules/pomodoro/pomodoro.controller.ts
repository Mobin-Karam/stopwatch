import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { UserService } from '../user/user.service';
import { EventsService } from '../events/events.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('pomodoro')
@UseGuards(AuthenticatedGuard)
export class PomodoroController {
  constructor(
    private readonly pomodoroService: PomodoroService,
    private readonly userService: UserService,
    private readonly eventsService: EventsService,
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

  @Post('start')
  async start(
    @Req() req: any,
    @Body('durationMinutes') durationMinutes?: number,
    @Body('note') note?: string,
    @Body('projectId') projectId?: string,
  ) {
    const user = await this.ensureUser(req);
    const session = await this.pomodoroService.startSession(
      user._id,
      durationMinutes ?? 25,
      note,
      projectId as any,
    );
    this.eventsService.emit({
      type: 'pomodoro:started',
      projectId: projectId,
      payload: { sessionId: session._id.toString(), duration: session.durationMinutes },
    });
    return session;
  }

  @Post('complete/:id')
  async complete(@Param('id') id: string) {
    const session = await this.pomodoroService.completeSession(id);
    this.eventsService.emit({
      type: 'pomodoro:completed',
      projectId: (session as any).projectId?.toString?.(),
      payload: { sessionId: id, focusMinutes: session.focusMinutes },
    });
    return session;
  }

  @Post('cancel/:id')
  async cancel(@Param('id') id: string) {
    const session = await this.pomodoroService.cancelSession(id);
    this.eventsService.emit({
      type: 'pomodoro:canceled',
      projectId: (session as any).projectId?.toString?.(),
      payload: { sessionId: id },
    });
    return session;
  }

  @Get('recent')
  async recent(@Req() req: any, @Query('days') days?: string) {
    const user = await this.ensureUser(req);
    const parsedDays = days ? Number(days) : 7;
    return this.pomodoroService.recentSessions(
      user._id,
      Number.isFinite(parsedDays) ? parsedDays : 7,
    );
  }

  @Get('summary')
  async summary(@Req() req: any, @Query('days') days?: string) {
    const user = await this.ensureUser(req);
    const parsedDays = days ? Number(days) : 7;
    return this.pomodoroService.summary(
      user._id,
      Number.isFinite(parsedDays) ? parsedDays : 7,
    );
  }
}

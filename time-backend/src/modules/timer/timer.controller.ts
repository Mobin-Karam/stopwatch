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
import { TimerService } from './timer.service';
import { UserService } from '../user/user.service';
import { EventsService } from '../events/events.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('timer')
@UseGuards(AuthenticatedGuard)
export class TimerController {
  constructor(
    private readonly timerService: TimerService,
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

  @Post('logs')
  async record(
    @Req() req: any,
    @Body('kind') kind: 'stopwatch' | 'countdown',
    @Body('label') label: string,
    @Body('durationMs') durationMs: number,
    @Body('laps') laps?: number[],
    @Body('startedAt') startedAt?: string,
    @Body('endedAt') endedAt?: string,
    @Body('status') status?: 'completed' | 'canceled',
    @Body('projectId') projectId?: string,
  ) {
    const user = await this.ensureUser(req);
    const log = await this.timerService.recordLog(user._id, {
      kind,
      label,
      durationMs,
      laps,
      startedAt: startedAt ?? new Date().toISOString(),
      endedAt,
      status,
      projectId: projectId as any,
    });
    this.eventsService.emit({
      type: 'timer:logged',
      projectId: projectId,
      payload: { logId: log._id.toString(), kind, durationMs },
    });
    return log;
  }

  @Get('logs')
  async list(@Req() req: any, @Query('limit') limit?: string) {
    const user = await this.ensureUser(req);
    const parsed = limit ? Number(limit) : 50;
    return this.timerService.recentLogs(
      user._id,
      Number.isFinite(parsed) ? parsed : 50,
    );
  }

  @Delete('logs/:id')
  async remove(@Param('id') id: string) {
    const res = await this.timerService.deleteLog(id);
    this.eventsService.emit({
      type: 'timer:deleted',
      payload: { logId: id },
    });
    return res;
  }
}

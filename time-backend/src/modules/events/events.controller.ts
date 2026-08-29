import { Controller, Query, Sse, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService, AppEvent } from './events.service';
import { AuthenticatedGuard } from '../../common/guards/guards';
import { Throttle } from '@nestjs/throttler';

@Controller('events')
@UseGuards(AuthenticatedGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('stream')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  stream(
    @Query('projectId') projectId?: string,
    @Query('teamId') teamId?: string,
  ): Observable<MessageEvent> {
    return this.eventsService.stream({ projectId, teamId }) as any;
  }
}

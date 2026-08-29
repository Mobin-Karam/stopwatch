import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent, map, filter } from 'rxjs';

export type AppEvent = {
  type: string;
  projectId?: string;
  teamId?: string;
  payload?: any;
};

@Injectable()
export class EventsService {
  private emitter = new EventEmitter();

  emit(event: AppEvent) {
    this.emitter.emit('app-event', event);
  }

  stream(filters?: { projectId?: string; teamId?: string }) {
    return fromEvent<AppEvent>(this.emitter, 'app-event').pipe(
      filter((evt) => {
        if (filters?.teamId && evt.teamId !== filters.teamId) return false;
        if (filters?.projectId && evt.projectId !== filters.projectId)
          return false;
        return true;
      }),
      map((evt) => ({ data: evt })),
    );
  }
}

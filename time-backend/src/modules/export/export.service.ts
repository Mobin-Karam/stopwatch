import { Injectable } from '@nestjs/common';
import { PlannerService } from '../planner/planner.service';
import { PomodoroService } from '../pomodoro/pomodoro.service';
import { TimerService } from '../timer/timer.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class ExportService {
  constructor(
    private readonly plannerService: PlannerService,
    private readonly pomodoroService: PomodoroService,
    private readonly timerService: TimerService,
    private readonly projectService: ProjectService,
  ) {}

  async fullExport(userId: string) {
    const [projects, tasks, pomodoros, timers] = await Promise.all([
      this.projectService.list(userId as any),
      this.plannerService.listTasks(userId as any),
      this.pomodoroService.summary(userId as any, 3650), // 10-year window
      this.timerService.recentLogs(userId as any, 5000),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      projects,
      planner: tasks,
      pomodoro: pomodoros,
      timers,
    };
  }

  async csvExport(userId: string, type: 'planner' | 'timer' = 'planner') {
    if (type === 'planner') {
      const tasks = await this.plannerService.listTasks(userId as any);
      const header = [
        'id',
        'title',
        'status',
        'priority',
        'scheduledFor',
        'projectId',
      ];
      const rows = tasks.map((t: any) => [
        t._id,
        t.title,
        t.status,
        t.priority,
        t.scheduledFor ? new Date(t.scheduledFor).toISOString() : '',
        t.projectId ?? '',
      ]);
      return this.toCsv(header, rows);
    }

    const logs = await this.timerService.recentLogs(userId as any, 5000);
    const header = [
      'id',
      'kind',
      'label',
      'durationMs',
      'laps',
      'startedAt',
      'endedAt',
      'status',
      'projectId',
    ];
    const rows = logs.map((l: any) => [
      l._id,
      l.kind,
      l.label ?? '',
      l.durationMs ?? 0,
      (l.laps ?? []).join('|'),
      l.startedAt ? new Date(l.startedAt).toISOString() : '',
      l.endedAt ? new Date(l.endedAt).toISOString() : '',
      l.status,
      l.projectId ?? '',
    ]);
    return this.toCsv(header, rows);
  }

  private toCsv(headers: string[], rows: any[][]): string {
    const esc = (val: any) => {
      const str =
        val === null || val === undefined ? '' : String(val).replace(/"/g, '""');
      if (/[",\n]/.test(str)) return `"${str}"`;
      return str;
    };
    const lines = [headers.map(esc).join(',')];
    for (const row of rows) {
      lines.push(row.map(esc).join(','));
    }
    return lines.join('\n');
  }
}

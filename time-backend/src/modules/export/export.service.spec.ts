import { ExportService } from './export.service';

describe('ExportService', () => {
  const plannerService = { listTasks: jest.fn() };
  const pomodoroService = { summary: jest.fn() };
  const timerService = { recentLogs: jest.fn() };
  const projectService = { list: jest.fn() };

  let service: ExportService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ExportService(
      plannerService as any,
      pomodoroService as any,
      timerService as any,
      projectService as any,
    );
    plannerService.listTasks.mockResolvedValue([{ _id: 'task-1' }]);
    pomodoroService.summary.mockResolvedValue([{ date: '2024-01-01', totalFocusMinutes: 25 }]);
    timerService.recentLogs.mockResolvedValue([{ _id: 'log-1' }]);
    projectService.list.mockResolvedValue([{ _id: 'proj-1' }]);
  });

  it('returns aggregated export data', async () => {
    const res = await service.fullExport('user-1');
    expect(projectService.list).toHaveBeenCalledWith('user-1');
    expect(plannerService.listTasks).toHaveBeenCalledWith('user-1');
    expect(pomodoroService.summary).toHaveBeenCalled();
    expect(timerService.recentLogs).toHaveBeenCalled();
    expect(res.projects.length).toBe(1);
    expect(res.planner.length).toBe(1);
    expect(res.pomodoro.length).toBe(1);
    expect(res.timers.length).toBe(1);
  });

  it('exports planner CSV', async () => {
    plannerService.listTasks.mockResolvedValue([
      {
        _id: 'task-1',
        title: 'Task',
        status: 'pending',
        priority: 1,
        scheduledFor: '2024-01-01T00:00:00Z',
        projectId: 'proj-1',
      },
    ]);

    const csv = await service.csvExport('user-1', 'planner');

    expect(csv).toContain('title,status,priority');
    expect(csv).toContain('Task');
  });

  it('exports timer CSV', async () => {
    timerService.recentLogs.mockResolvedValue([
      {
        _id: 'log-1',
        kind: 'stopwatch',
        label: 'Sprint',
        durationMs: 120000,
        laps: [60000],
        startedAt: '2024-01-01T00:00:00Z',
        endedAt: '2024-01-01T00:02:00Z',
        status: 'completed',
        projectId: 'proj-1',
      },
    ]);

    const csv = await service.csvExport('user-1', 'timer');

    expect(csv).toContain('kind,label,durationMs');
    expect(csv).toContain('Sprint');
  });
});

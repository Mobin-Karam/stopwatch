import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  let controller: DashboardController;
  const pomodoroService = {
    summary: jest.fn(),
  };
  const plannerService = {
    summary: jest.fn(),
    listTasks: jest.fn(),
  };
  const timerService = {
    recentLogs: jest.fn(),
  };
  const projectService = {
    list: jest.fn(),
  };
  const userService = {
    getOrCreateDefault: jest.fn(),
    getUser: jest.fn(),
  };

  let req: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { session: {}, user: { _id: 'u1', id: 'u1' } };
    controller = new DashboardController(
      pomodoroService as any,
      plannerService as any,
      userService as any,
      timerService as any,
      projectService as any,
    );
    userService.getUser = jest.fn().mockResolvedValue({
      id: 'u1',
      _id: 'u1',
    }) as any;
    plannerService.summary.mockResolvedValue([]);
    pomodoroService.summary.mockResolvedValue([]);
    plannerService.listTasks.mockResolvedValue([
      { status: 'done' },
      { status: 'pending' },
    ]);
    timerService.recentLogs.mockResolvedValue([{ projectId: 'proj-1' }]);
    projectService.list.mockResolvedValue([
      { _id: 'proj-1', name: 'Proj', color: '#000' },
    ]);
  });

  it('returns combined summaries and today counts', async () => {
    const res = await controller.summary(req as any, '7');

    expect(pomodoroService.summary).toHaveBeenCalledWith('u1', 7);
    expect(plannerService.summary).toHaveBeenCalledWith('u1', 7);
    expect(plannerService.listTasks).toHaveBeenCalled();
    expect(timerService.recentLogs).toHaveBeenCalledWith('u1', 200, undefined);
    expect(projectService.list).toHaveBeenCalledWith('u1');
    expect(res.planner.today).toEqual({ done: 1, pending: 1, total: 2 });
    expect(res.projects[0].timerSessions).toBe(1);
    expect(res.rangeDays).toBe(7);
  });

  it('filters project when projectId is supplied', async () => {
    const res = await controller.summary(req as any, '7', 'proj-1');
    expect(res.project?.projectId).toBe('proj-1');
  });

  it('defaults to 7 days when days is invalid', async () => {
    const res = await controller.summary(req as any, 'nan');
    expect(res.rangeDays).toBe(7);
  });
});

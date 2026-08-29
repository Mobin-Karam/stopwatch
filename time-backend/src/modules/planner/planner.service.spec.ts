import { Model } from 'mongoose';
import { PlannerService } from './planner.service';
import { PlannerTaskDocument } from './schemas/planner-task.schema';

const toDate = (str: string) => new Date(str);

const makeDoc = (overrides: Partial<PlannerTaskDocument> = {}) =>
  ({
    _id: 'task-1',
    userId: 'user-1',
    title: 'Task',
    status: 'pending',
    priority: 0,
    scheduledFor: toDate('2024-01-01T00:00:00Z'),
    order: 0,
    tags: [],
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as any;

const createChain = (result: any[] = []) => {
  const chain: any = {
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };
  return chain;
};

describe('PlannerService', () => {
  let service: PlannerService;
  let model: jest.Mocked<Model<PlannerTaskDocument>>;
  let findChain: any;

  beforeEach(() => {
    findChain = createChain();
    model = {
      create: jest.fn(),
      findById: jest.fn(),
      find: jest.fn().mockReturnValue(findChain),
    } as any;
    service = new PlannerService(model);
    jest.useRealTimers();
  });

  it('creates a task and normalizes date to UTC midnight', async () => {
    const doc = makeDoc();
    model.create.mockResolvedValue(doc);

    const result = await service.createTask('user-1' as any, {
      title: 'Plan',
      date: '2024-01-05',
      priority: 2,
      tags: ['work'],
    });

    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        title: 'Plan',
        priority: 2,
        tags: ['work'],
      }),
    );
    expect(result).toBe(doc);
  });

  it('lists tasks for a specific date', async () => {
    findChain.lean.mockResolvedValue([{ _id: 'a' }]);

    const res = await service.listTasks('user-1' as any, '2024-01-02');

    expect(model.find).toHaveBeenCalled();
    expect(res).toEqual([{ _id: 'a' }]);
  });

  it('updates task fields including status and date', async () => {
    const doc = makeDoc();
    model.findById.mockResolvedValue(doc);

    const updated = await service.updateTask('task-1', {
      title: 'Updated',
      status: 'done',
      date: '2024-01-03',
      priority: 1,
      order: 2,
    });

    expect(updated.title).toBe('Updated');
    expect(updated.status).toBe('done');
    expect(updated.priority).toBe(1);
    expect(updated.order).toBe(2);
    expect(doc.save).toHaveBeenCalled();
  });

  it('archives task on delete', async () => {
    const doc = makeDoc();
    model.findById.mockResolvedValue(doc);

    const res = await service.deleteTask('task-1');

    expect(res.status).toBe('archived');
    expect(doc.save).toHaveBeenCalled();
  });

  it('summarizes pending/done counts per day', async () => {
    const tasks = [
      { scheduledFor: toDate('2024-01-01T00:00:00Z'), status: 'pending' },
      { scheduledFor: toDate('2024-01-01T00:00:00Z'), status: 'done' },
      { scheduledFor: toDate('2024-01-02T00:00:00Z'), status: 'done' },
    ];
    model.find.mockReturnValue(createChain(tasks));

    const summary = await service.summary('user-1' as any, 7);

    expect(summary).toEqual([
      { date: '2024-01-02', done: 1, pending: 0, total: 1 },
      { date: '2024-01-01', done: 1, pending: 1, total: 2 },
    ]);
  });
});

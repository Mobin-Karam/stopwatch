import { Model } from 'mongoose';
import { TimerService } from './timer.service';
import { TimerLogDocument } from './schemas/timer-log.schema';

const makeDoc = (overrides: Partial<TimerLogDocument> = {}) =>
  ({
    _id: 'log-1',
    userId: 'user-1',
    kind: 'stopwatch',
    durationMs: 1000,
    laps: [200, 400],
    startedAt: new Date('2024-01-01T00:00:00Z'),
    endedAt: new Date('2024-01-01T00:00:01Z'),
    status: 'completed',
    deleteOne: jest.fn().mockResolvedValue(undefined),
  }) as any;

const createChain = (result: any[] = []) => {
  const chain: any = {
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };
  return chain;
};

describe('TimerService', () => {
  let service: TimerService;
  let model: jest.Mocked<Model<TimerLogDocument>>;
  let findChain: any;

  beforeEach(() => {
    findChain = createChain();
    model = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue(findChain),
      findById: jest.fn(),
    } as any;
    service = new TimerService(model);
    jest.useRealTimers();
  });

  it('records a log entry', async () => {
    const doc = makeDoc();
    model.create.mockResolvedValue(doc);

    const res = await service.recordLog('user-1' as any, {
      kind: 'stopwatch',
      durationMs: 5000,
      laps: [1000],
      startedAt: '2024-02-01T00:00:00Z',
      label: 'Session',
    });

    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        kind: 'stopwatch',
        durationMs: 5000,
        laps: [1000],
        label: 'Session',
      }),
    );
    expect(res).toBe(doc);
  });

  it('returns recent logs with limit', async () => {
    findChain.lean.mockResolvedValue([{ _id: 'a' }]);

    const res = await service.recentLogs('user-1' as any, 5);

    expect(model.find).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(res).toEqual([{ _id: 'a' }]);
  });

  it('deletes a log', async () => {
    const doc = makeDoc();
    model.findById.mockResolvedValue(doc);

    const res = await service.deleteLog('log-1');

    expect(doc.deleteOne).toHaveBeenCalled();
    expect(res).toEqual({ deleted: true });
  });
});

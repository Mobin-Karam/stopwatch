import { Model } from 'mongoose';
import { PomodoroService } from './pomodoro.service';
import { PomodoroSessionDocument } from './schemas/pomodoro-session.schema';

const createChain = (result: any[] = []) => {
  const chain: any = {
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };
  return chain;
};

const makeDoc = (overrides: Partial<PomodoroSessionDocument> = {}) =>
  ({
    _id: 'sess-1',
    userId: 'user-1',
    durationMinutes: 25,
    status: 'running',
    startedAt: new Date('2024-01-01T00:00:00Z'),
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as any;

describe('PomodoroService', () => {
  let service: PomodoroService;
  let model: jest.Mocked<Model<PomodoroSessionDocument>>;
  let findChain: any;

  beforeEach(() => {
    findChain = createChain();
    model = {
      create: jest.fn(),
      findById: jest.fn(),
      find: jest.fn().mockReturnValue(findChain),
    } as any;
    service = new PomodoroService(model);
    jest.useRealTimers();
  });

  it('starts a session with defaults', async () => {
    const fakeSession = makeDoc({ durationMinutes: 30, note: 'focus' });
    model.create.mockResolvedValue(fakeSession);

    const result = await service.startSession('user-1' as any, 30, 'focus');

    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        durationMinutes: 30,
        status: 'running',
        note: 'focus',
      }),
    );
    expect(result).toBe(fakeSession);
  });

  it('completes a session and computes focus minutes', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:15:00Z'));
    const doc = makeDoc({
      durationMinutes: 20,
      startedAt: new Date('2024-01-01T00:00:00Z'),
    });
    model.findById.mockResolvedValue(doc);

    const result = await service.completeSession('sess-1');

    expect(result.status).toBe('completed');
    expect(result.focusMinutes).toBe(15); // min(elapsed 15, planned 20)
    expect(doc.save).toHaveBeenCalled();
  });

  it('cancels a session', async () => {
    const doc = makeDoc();
    model.findById.mockResolvedValue(doc);

    const result = await service.cancelSession('sess-1');

    expect(result.status).toBe('canceled');
    expect(doc.save).toHaveBeenCalled();
  });

  it('returns recent sessions with defaults', async () => {
    findChain.lean.mockResolvedValue([{ _id: 'a' }]);

    const res = await service.recentSessions('user-1' as any);

    expect(model.find).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1' }),
    );
    expect(res).toEqual([{ _id: 'a' }]);
  });

  it('summarizes focus minutes per day', async () => {
    const sessions = [
      {
        startedAt: new Date('2024-01-01T00:00:00Z'),
        focusMinutes: 20,
        durationMinutes: 25,
      },
      {
        startedAt: new Date('2024-01-01T05:00:00Z'),
        focusMinutes: 10,
        durationMinutes: 25,
      },
      {
        startedAt: new Date('2024-01-02T00:00:00Z'),
        focusMinutes: 15,
        durationMinutes: 25,
      },
    ];
    model.find.mockReturnValue(createChain(sessions));

    const summary = await service.summary('user-1' as any, 7);

    expect(summary).toEqual([
      { date: '2024-01-02', totalFocusMinutes: 15, sessions: 1 },
      { date: '2024-01-01', totalFocusMinutes: 30, sessions: 2 },
    ]);
  });
});

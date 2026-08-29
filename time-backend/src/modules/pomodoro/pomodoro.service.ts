import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PomodoroSession,
  PomodoroSessionDocument,
} from './schemas/pomodoro-session.schema';

type SummaryDay = {
  date: string; // YYYY-MM-DD in UTC
  totalFocusMinutes: number;
  sessions: number;
};

@Injectable()
export class PomodoroService {
  constructor(
    @InjectModel(PomodoroSession.name)
    private sessionModel: Model<PomodoroSessionDocument>,
  ) {}

  async startSession(
    userId: Types.ObjectId,
    durationMinutes = 25,
    note?: string,
    projectId?: Types.ObjectId,
  ) {
    const duration = durationMinutes > 0 ? durationMinutes : 25;
    return this.sessionModel.create({
      userId,
      projectId,
      durationMinutes: duration,
      status: 'running',
      startedAt: new Date(),
      note,
    });
  }

  async completeSession(sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');

    if (session.status === 'completed') return session;

    session.endedAt = new Date();
    session.status = 'completed';

    const elapsedMinutes = Math.max(
      0,
      Math.round(
        (session.endedAt.getTime() - session.startedAt.getTime()) / 60000,
      ),
    );
    const planned = session.durationMinutes ?? elapsedMinutes;
    session.focusMinutes = Math.min(elapsedMinutes, planned);

    await session.save();
    return session;
  }

  async cancelSession(sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');

    session.status = 'canceled';
    session.endedAt = new Date();
    await session.save();
    return session;
  }

  async recentSessions(userId: Types.ObjectId, days = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.sessionModel
      .find({ userId, startedAt: { $gte: since } })
      .sort({ startedAt: -1 })
      .limit(100)
      .lean();
  }

  async summary(
    userId?: Types.ObjectId,
    days = 7,
    projectId?: Types.ObjectId,
  ): Promise<SummaryDay[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const sessions = await this.sessionModel
      .find({
        ...(userId ? { userId } : {}),
        startedAt: { $gte: since },
        status: 'completed',
        ...(projectId ? { projectId } : {}),
      })
      .lean();

    const daily = new Map<string, SummaryDay>();
    for (const s of sessions) {
      const dateKey = new Date(s.startedAt).toISOString().slice(0, 10);
      const focus = s.focusMinutes ?? s.durationMinutes ?? 0;
      const existing = daily.get(dateKey) ?? {
        date: dateKey,
        totalFocusMinutes: 0,
        sessions: 0,
      };
      existing.totalFocusMinutes += focus;
      existing.sessions += 1;
      daily.set(dateKey, existing);
    }

    return Array.from(daily.values()).sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
    );
  }
}

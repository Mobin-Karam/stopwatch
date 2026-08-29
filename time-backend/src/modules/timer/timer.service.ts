import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimerLog, TimerLogDocument } from './schemas/timer-log.schema';

type CreateLogDto = {
  kind: 'stopwatch' | 'countdown';
  label?: string;
  durationMs: number;
  laps?: number[];
  startedAt: string | Date;
  endedAt?: string | Date;
  status?: 'completed' | 'canceled';
  projectId?: string | Types.ObjectId;
};

@Injectable()
export class TimerService {
  constructor(
    @InjectModel(TimerLog.name)
    private timerModel: Model<TimerLogDocument>,
  ) {}

  async recordLog(userId: Types.ObjectId, dto: CreateLogDto) {
    return this.timerModel.create({
      userId,
      projectId: (dto as any).projectId,
      kind: dto.kind,
      label: dto.label?.trim(),
      durationMs: dto.durationMs ?? 0,
      laps: dto.laps ?? [],
      startedAt: new Date(dto.startedAt),
      endedAt: dto.endedAt ? new Date(dto.endedAt) : undefined,
      status: dto.status ?? 'completed',
    });
  }

  async recentLogs(
    userId?: Types.ObjectId,
    limit = 50,
    projectId?: Types.ObjectId,
  ) {
    const safeLimit = Number.isFinite(limit) ? Math.min(limit, 200) : 50;
    const filter: any = { ...(projectId ? { projectId } : {}) };
    if (userId) filter.userId = userId;
    return this.timerModel
      .find(filter)
      .sort({ startedAt: -1 })
      .limit(safeLimit)
      .lean();
  }

  async deleteLog(logId: string) {
    const doc = await this.timerModel.findById(logId);
    if (!doc) throw new NotFoundException('Timer log not found');
    await doc.deleteOne();
    return { deleted: true };
  }
}

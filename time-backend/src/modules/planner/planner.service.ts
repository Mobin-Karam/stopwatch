import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PlannerTask,
  PlannerTaskDocument,
} from './schemas/planner-task.schema';

export type CreateTaskDto = {
  title: string;
  date: string; // YYYY-MM-DD
  priority?: number;
  tags?: string[];
  projectId?: string | Types.ObjectId;
};

export type UpdateTaskDto = Partial<{
  title: string;
  status: 'pending' | 'done' | 'archived';
  priority: number;
  date: string;
  order: number;
  projectId: Types.ObjectId;
  tags: string[];
}>;

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(PlannerTask.name)
    private taskModel: Model<PlannerTaskDocument>,
  ) {}

  private toDateOnly(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    // Normalize to UTC midnight to make grouping consistent
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  async createTask(userId: Types.ObjectId, dto: CreateTaskDto) {
    const scheduledFor = this.toDateOnly(dto.date);
    const priority = dto.priority ?? 0;
    return this.taskModel.create({
      userId,
      projectId: (dto as any).projectId,
      title: dto.title.trim(),
      scheduledFor,
      priority,
      status: 'pending',
      tags: dto.tags ?? [],
    });
  }

  async listTasks(
    userId?: Types.ObjectId,
    date?: string,
    projectId?: Types.ObjectId,
    tag?: string,
  ) {
    const filter: any = { status: { $ne: 'archived' } };
    if (userId) filter.userId = userId;
    if (projectId) filter.projectId = projectId;
    if (tag) filter.tags = tag;
    if (date) {
      const day = this.toDateOnly(date);
      const next = new Date(day.getTime() + 24 * 60 * 60 * 1000);
      filter.scheduledFor = { $gte: day, $lt: next };
    }
    return this.taskModel.find(filter).sort({ scheduledFor: 1, order: 1 }).lean();
  }

  async updateTask(taskId: string, dto: UpdateTaskDto) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    if (dto.title !== undefined) task.title = dto.title.trim();
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.order !== undefined) task.order = dto.order;
    if (dto.date !== undefined) task.scheduledFor = this.toDateOnly(dto.date);
    if ((dto as any).projectId !== undefined)
      (task as any).projectId = (dto as any).projectId;
    if (dto.tags !== undefined) task.tags = dto.tags ?? [];

    await task.save();
    return task;
  }

  async deleteTask(taskId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    task.status = 'archived';
    await task.save();
    return task;
  }

  async summary(
    userId?: Types.ObjectId,
    days = 7,
    projectId?: Types.ObjectId,
  ) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const tasks = await this.taskModel
      .find({
        ...(userId ? { userId } : {}),
        scheduledFor: { $gte: this.toDateOnly(since.toISOString()) },
        status: { $in: ['pending', 'done'] },
        ...(projectId ? { projectId } : {}),
      })
      .lean();

    const map = new Map<
      string,
      { date: string; done: number; pending: number; total: number }
    >();

    for (const t of tasks) {
      const dateKey = new Date(t.scheduledFor).toISOString().slice(0, 10);
      const existing =
        map.get(dateKey) ?? { date: dateKey, done: 0, pending: 0, total: 0 };
      if (t.status === 'done') existing.done += 1;
      else existing.pending += 1;
      existing.total += 1;
      map.set(dateKey, existing);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
    );
  }
}

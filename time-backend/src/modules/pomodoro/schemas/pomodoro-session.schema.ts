import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PomodoroSessionDocument = PomodoroSession & Document;

@Schema({ timestamps: true })
export class PomodoroSession {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ default: 25, min: 1, max: 180 })
  durationMinutes: number;

  @Prop({ enum: ['running', 'completed', 'canceled'], default: 'running' })
  status: 'running' | 'completed' | 'canceled';

  @Prop({ required: true })
  startedAt: Date;

  @Prop()
  endedAt?: Date;

  @Prop()
  focusMinutes?: number;

  @Prop()
  note?: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', index: true, required: false })
  projectId?: Types.ObjectId;
}

export const PomodoroSessionSchema =
  SchemaFactory.createForClass(PomodoroSession);
PomodoroSessionSchema.index({ userId: 1, startedAt: -1 });
PomodoroSessionSchema.index({ projectId: 1, startedAt: -1 });

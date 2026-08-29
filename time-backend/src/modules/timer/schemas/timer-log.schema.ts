import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TimerLogDocument = TimerLog & Document;

@Schema({ timestamps: true })
export class TimerLog {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ enum: ['stopwatch', 'countdown'], required: true })
  kind: 'stopwatch' | 'countdown';

  @Prop()
  label?: string;

  @Prop({ default: 0 })
  durationMs: number;

  @Prop({ type: [Number], default: [] })
  laps: number[];

  @Prop({ required: true })
  startedAt: Date;

  @Prop()
  endedAt?: Date;

  @Prop({ enum: ['completed', 'canceled'], default: 'completed' })
  status: 'completed' | 'canceled';

  @Prop({ type: Types.ObjectId, ref: 'Project', index: true, required: false })
  projectId?: Types.ObjectId;
}

export const TimerLogSchema = SchemaFactory.createForClass(TimerLog);
TimerLogSchema.index({ userId: 1, startedAt: -1 });
TimerLogSchema.index({ projectId: 1, startedAt: -1 });

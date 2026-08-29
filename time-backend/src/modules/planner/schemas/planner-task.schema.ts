import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlannerTaskDocument = PlannerTask & Document;

@Schema({ timestamps: true })
export class PlannerTask {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ default: 'pending', enum: ['pending', 'done', 'archived'] })
  status: 'pending' | 'done' | 'archived';

  @Prop({ default: 0, min: 0 })
  priority: number;

  @Prop({ required: true })
  scheduledFor: Date; // date-only semantics; UTC midnight

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Project', index: true, required: false })
  projectId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags?: string[];
}

export const PlannerTaskSchema = SchemaFactory.createForClass(PlannerTask);
PlannerTaskSchema.index({ userId: 1, scheduledFor: 1 });
PlannerTaskSchema.index({ projectId: 1, scheduledFor: 1 });
PlannerTaskSchema.index({ tags: 1 });
PlannerTaskSchema.index({ status: 1 });

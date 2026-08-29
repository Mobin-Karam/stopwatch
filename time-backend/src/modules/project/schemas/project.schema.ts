import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Team', index: true, required: false })
  teamId?: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ default: '#60a5fa' })
  color: string;

  @Prop({ default: false })
  archived: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ teamId: 1, archived: 1 });

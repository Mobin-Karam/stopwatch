import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamMessageDocument = TeamMessage & Document;

@Schema({ timestamps: true })
export class TeamMessage {
  @Prop({ type: Types.ObjectId, ref: 'Team', index: true, required: true })
  teamId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', index: true, required: false })
  projectId?: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 2000 })
  content: string;
}

export const TeamMessageSchema = SchemaFactory.createForClass(TeamMessage);
TeamMessageSchema.index({ teamId: 1, createdAt: -1 });

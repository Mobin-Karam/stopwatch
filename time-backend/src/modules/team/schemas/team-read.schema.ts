import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamReadDocument = TeamRead & Document;

@Schema({ timestamps: true })
export class TeamRead {
  @Prop({ type: Types.ObjectId, ref: 'Team', index: true, required: true })
  teamId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, default: () => new Date(0) })
  lastReadAt: Date;
}

export const TeamReadSchema = SchemaFactory.createForClass(TeamRead);
TeamReadSchema.index({ teamId: 1, userId: 1 }, { unique: true });

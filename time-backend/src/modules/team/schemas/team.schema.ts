import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  memberIds: Types.ObjectId[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
TeamSchema.index({ memberIds: 1 });

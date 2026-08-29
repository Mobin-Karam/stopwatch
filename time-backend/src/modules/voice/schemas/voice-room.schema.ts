import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VoiceRoomDocument = VoiceRoom & Document;

@Schema({ timestamps: true })
export class VoiceRoom {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, index: true, unique: true })
  room: string;

  @Prop({ type: Types.ObjectId, ref: 'Team', index: true, required: false })
  teamId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const VoiceRoomSchema = SchemaFactory.createForClass(VoiceRoom);
VoiceRoomSchema.index({ teamId: 1, room: 1 });

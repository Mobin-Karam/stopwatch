import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop() name: string;
  @Prop({ index: true, unique: true, sparse: true }) email: string;
  @Prop() provider: string;
  @Prop() providerId: string;
  @Prop() avatarColor?: string;
  @Prop({ default: 'dark' }) theme: string;
  @Prop({
    type: {
      elapsedMs: Number,
      laps: [Number],
      updatedAt: Date,
    },
    default: null,
  })
  lastStopwatch?: {
    elapsedMs: number;
    laps: number[];
    updatedAt?: Date;
  } | null;
  @Prop({
    type: {
      planId: String,
      status: {
        type: String,
        enum: ['none', 'pending', 'active', 'canceled', 'failed'],
        default: 'none',
      },
      authority: String,
      refId: String,
      expiresAt: Date,
      lastReceipt: Object,
    },
    default: { status: 'none' },
  })
  subscription?: any;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

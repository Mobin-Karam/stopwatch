import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DonationDocument = Donation & Document;

@Schema({ timestamps: true })
export class Donation {
  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop()
  note?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  emailSnapshot?: string;

  @Prop({ enum: ['pending', 'paid', 'failed'], default: 'pending' })
  status: 'pending' | 'paid' | 'failed';

  @Prop()
  authority?: string;

  @Prop()
  refId?: string;

  // store gateway response; Mixed avoids NestJS type ambiguity
  @Prop({ type: Object })
  receipt?: Record<string, any>;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

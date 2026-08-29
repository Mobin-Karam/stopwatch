import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { Donation, DonationSchema } from './schemas/donation.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Donation.name, schema: DonationSchema },
    ]),
    UserModule,
  ],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}

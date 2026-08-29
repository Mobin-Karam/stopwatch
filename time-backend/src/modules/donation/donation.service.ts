import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from './schemas/donation.schema';
import { zarinpalRequest, zarinpalVerify } from '../subscription/zarinpal';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
  ) {}

  async createRequest(params: {
    amount: number;
    note?: string;
    user?: any;
    merchantId: string;
    callbackBase: string;
  }) {
    const { amount, note, user, merchantId, callbackBase } = params;
    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const donation = await this.donationModel.create({
      amount,
      note,
      status: 'pending',
      userId: user?._id,
      emailSnapshot: user?.email,
    });

    const callbackUrl = `${callbackBase.replace(/\/$/, '')}/api/donations/callback?donationId=${donation.id}`;

    const requestRes = await zarinpalRequest({
      merchant_id: merchantId,
      amount,
      description: `Time donation ${donation.id}`,
      callback_url: callbackUrl,
      currency: 'IRT',
      metadata: { email: user?.email ?? '', mobile: '' },
    });

    const data = requestRes?.data;
    if (!data || data.code !== 100) {
      await donation.updateOne({ status: 'failed', receipt: requestRes });
      throw new Error(`Zarinpal request failed ${JSON.stringify(requestRes)}`);
    }

    donation.authority = data.authority;
    await donation.save();

    return {
      donationId: donation.id,
      authority: data.authority,
      redirect: `https://www.zarinpal.com/pg/StartPay/${data.authority}`,
    };
  }

  async verifyDonation(
    authority: string,
    donationId: string | undefined,
    merchantId: string,
  ) {
    const donation = donationId
      ? await this.donationModel.findById(donationId)
      : await this.donationModel.findOne({ authority });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    const verifyRes = await zarinpalVerify({
      merchant_id: merchantId,
      amount: donation.amount,
      authority,
    });

    const data = verifyRes?.data;
    if (!data || (data.code !== 100 && data.code !== 101)) {
      donation.status = 'failed';
      donation.receipt = verifyRes;
      await donation.save();
      throw new BadRequestException(`Verify failed code=${data?.code}`);
    }

    donation.status = 'paid';
    donation.refId = data.ref_id;
    donation.receipt = verifyRes;
    await donation.save();

    return donation;
  }

  async markFailed(authority: string, donationId?: string, receipt?: any) {
    const donation = donationId
      ? await this.donationModel.findById(donationId)
      : await this.donationModel.findOne({ authority });
    if (!donation) return null;
    donation.status = 'failed';
    donation.receipt = receipt;
    await donation.save();
    return donation;
  }
}

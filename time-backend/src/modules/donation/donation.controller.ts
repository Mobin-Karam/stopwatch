import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { DonationService } from './donation.service';
import { UserService } from '../user/user.service';

@Controller('donations')
export class DonationController {
  constructor(
    private readonly donationService: DonationService,
    private readonly userService: UserService,
  ) {}

  private async getUserIfAny(req: any) {
    if (req.user) return req.user;
    if (req.session?.userId) {
      return this.userService.getUser(req.session.userId);
    }
    return null;
  }

  @Post('request')
  async request(@Req() req: any, @Body() body: any) {
    const user = await this.getUserIfAny(req);
    const amount = Number(body.amount);
    const note =
      typeof body.note === 'string' ? body.note.slice(0, 500) : undefined;

    const result = await this.donationService.createRequest({
      amount,
      note,
      user,
      merchantId: process.env.ZARINPAL_MERCHANT_ID || '',
      callbackBase: process.env.APP_BASE_URL || 'http://localhost:3000',
    });

    return result;
  }

  @Get('callback')
  async callback(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Query('donationId') donationId?: string,
  ) {
    if (!authority) {
      return { ok: false, message: 'Missing authority' };
    }

    if (status !== 'OK') {
      await this.donationService.markFailed(authority, donationId, { status });
      return { ok: false, message: 'Payment canceled' };
    }

    const donation = await this.donationService.verifyDonation(
      authority,
      donationId,
      process.env.ZARINPAL_MERCHANT_ID || '',
    );
    return { ok: true, donation };
  }
}

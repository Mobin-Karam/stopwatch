import { Controller, Get, Post, Body, Query, Param, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UserService } from '../user/user.service';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('subscriptions')
@UseGuards(AuthenticatedGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
  ) {}

  private async ensureUser(req: any) {
    if (req.user) {
      if (!req.session?.userId) req.session.userId = req.user.id;
      return req.user;
    }
    if (!req.session?.userId) {
      throw new UnauthorizedException();
    }
    return this.userService.getUser(req.session.userId);
  }

  @Get('plans')
  async plans(@Req() req: any) {
    const user = req.session.userId
      ? await this.userService.getUser(req.session.userId)
      : null;
    return {
      plans: this.subscriptionService.listPlans(),
      active: user?.subscription ?? null,
    };
  }

  @Post('request')
  async request(@Req() req: any, @Body('planId') planId: string) {
    const user = await this.ensureUser(req);
    const result = await this.subscriptionService.startPayment(
      planId,
      process.env.ZARINPAL_MERCHANT_ID || '',
      process.env.APP_BASE_URL || 'http://localhost:3000',
      user,
    );
    return result;
  }

  @Get('verify')
  async verify(
    @Req() req: any,
    @Query('Authority') authority: string,
    @Query('planId') planId: string,
  ) {
    const user = await this.ensureUser(req);
    await this.subscriptionService.verifyPayment(
      authority,
      planId,
      process.env.ZARINPAL_MERCHANT_ID || '',
      user,
    );
    return { ok: true };
  }

  @Get('inquiry/:authority')
  async inquiry(@Param('authority') authority: string) {
    const response = await this.subscriptionService.inquiry(
      authority,
      process.env.ZARINPAL_MERCHANT_ID || '',
    );
    return response;
  }
}

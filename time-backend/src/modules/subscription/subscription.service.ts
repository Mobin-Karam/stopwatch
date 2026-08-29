import { Injectable } from '@nestjs/common';
import { zarinpalRequest, zarinpalVerify, zarinpalInquiry } from './zarinpal';

export type Plan = {
  id: 'free' | 'pro';
  name: string;
  amount: number;
  intervalDays: number;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    amount: 0,
    intervalDays: 0,
    features: ['Stopwatch', 'Local laps', 'Theme toggle'],
  },
  {
    id: 'pro',
    name: 'Pro',
    amount: 49000,
    intervalDays: 30,
    features: [
      'All timers',
      'Cloud sync & backups',
      'Unlimited laps',
      'Early access',
    ],
  },
];

const planMap = Object.fromEntries(PLANS.map((p) => [p.id, p]));

@Injectable()
export class SubscriptionService {
  listPlans() {
    return PLANS;
  }

  async startPayment(
    planId: string,
    merchantId: string,
    callbackBase: string,
    user: any,
  ) {
    const plan = planMap[planId];
    if (!plan) throw new Error('Plan not found');

    if (plan.amount === 0) {
      user.subscription = { planId, status: 'active', expiresAt: null };
      await user.save();
      return { free: true };
    }

    const callbackUrl = `${callbackBase}/api/subscriptions/verify?planId=${plan.id}`;
    const requestRes = await zarinpalRequest({
      merchant_id: merchantId,
      amount: plan.amount,
      description: `Time subscription - ${plan.name}`,
      callback_url: callbackUrl,
      currency: 'IRT',
      metadata: { email: user.email, mobile: '' },
    });

    const data = requestRes?.data;
    if (!data || data.code !== 100) {
      throw new Error(`Zarinpal request failed ${JSON.stringify(requestRes)}`);
    }

    user.subscription = {
      planId: plan.id,
      status: 'pending',
      authority: data.authority,
    };
    await user.save();

    return {
      authority: data.authority,
      redirect: `https://www.zarinpal.com/pg/StartPay/${data.authority}`,
    };
  }

  async verifyPayment(
    authority: string,
    planId: string,
    merchantId: string,
    user: any,
  ) {
    const plan = planMap[planId];
    if (!plan) throw new Error('Plan not found');

    const verifyRes = await zarinpalVerify({
      merchant_id: merchantId,
      amount: plan.amount,
      authority,
    });

    const data = verifyRes?.data;
    if (!data || (data.code !== 100 && data.code !== 101)) {
      user.subscription = {
        status: 'failed',
        planId,
        authority,
        lastReceipt: verifyRes,
      };
      await user.save();
      throw new Error(`Verify failed code=${data?.code}`);
    }

    const expiresAt =
      plan.intervalDays > 0
        ? new Date(Date.now() + plan.intervalDays * 24 * 60 * 60 * 1000)
        : null;

    user.subscription = {
      planId,
      status: 'active',
      authority,
      refId: data.ref_id,
      expiresAt,
      lastReceipt: verifyRes,
    };
    await user.save();

    return user.subscription;
  }

  inquiry(authority: string, merchantId: string) {
    return zarinpalInquiry({ merchant_id: merchantId, authority });
  }
}

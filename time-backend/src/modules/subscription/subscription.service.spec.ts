import { SubscriptionService } from './subscription.service';
import {
  zarinpalInquiry,
  zarinpalRequest,
  zarinpalVerify,
} from './zarinpal';

jest.mock('./zarinpal', () => ({
  zarinpalRequest: jest.fn(),
  zarinpalVerify: jest.fn(),
  zarinpalInquiry: jest.fn(),
}));

class FakeUser {
  subscription?: any;
  constructor(public email = 'demo@local') {}
  // Mimic mongoose document save
  save = jest.fn(async () => this);
}

describe('SubscriptionService payments', () => {
  let service: SubscriptionService;
  let mockRequest: jest.MockedFunction<typeof zarinpalRequest>;
  let mockVerify: jest.MockedFunction<typeof zarinpalVerify>;
  let mockInquiry: jest.MockedFunction<typeof zarinpalInquiry>;

  beforeEach(() => {
    service = new SubscriptionService();
    mockRequest = zarinpalRequest as jest.MockedFunction<
      typeof zarinpalRequest
    >;
    mockVerify = zarinpalVerify as jest.MockedFunction<typeof zarinpalVerify>;
    mockInquiry = zarinpalInquiry as jest.MockedFunction<
      typeof zarinpalInquiry
    >;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('activates free plan without hitting the gateway', async () => {
    const user = new FakeUser('free@test');

    const result = await service.startPayment(
      'free',
      'merchant-x',
      'https://app.test',
      user as any,
    );

    expect(result).toEqual({ free: true });
    expect(user.subscription).toEqual({
      planId: 'free',
      status: 'active',
      expiresAt: null,
    });
    expect(user.save).toHaveBeenCalledTimes(1);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('creates a paid request and stores pending authority', async () => {
    mockRequest.mockResolvedValue({
      data: { code: 100, authority: 'AUTH-123' },
    });
    const user = new FakeUser('pro@test');

    const result = await service.startPayment(
      'pro',
      'merchant-123',
      'https://app.test',
      user as any,
    );

    expect(mockRequest).toHaveBeenCalledWith({
      merchant_id: 'merchant-123',
      amount: 49000,
      description: 'Time subscription - Pro',
      callback_url: 'https://app.test/api/subscriptions/verify?planId=pro',
      currency: 'IRT',
      metadata: { email: 'pro@test', mobile: '' },
    });
    expect(user.subscription).toEqual({
      planId: 'pro',
      status: 'pending',
      authority: 'AUTH-123',
    });
    expect(result).toEqual({
      authority: 'AUTH-123',
      redirect: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    });
    expect(user.save).toHaveBeenCalledTimes(1);
  });

  it('marks subscription active when verification succeeds', async () => {
    const baseDate = new Date('2026-02-16T12:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(baseDate);
    mockVerify.mockResolvedValue({
      data: { code: 100, ref_id: 99999 },
    });
    const user = new FakeUser('pro@test');

    const subscription = await service.verifyPayment(
      'AUTH-123',
      'pro',
      'merchant-123',
      user as any,
    );

    expect(mockVerify).toHaveBeenCalledWith({
      merchant_id: 'merchant-123',
      amount: 49000,
      authority: 'AUTH-123',
    });
    expect(subscription.status).toBe('active');
    expect(subscription.planId).toBe('pro');
    expect(subscription.refId).toBe(99999);
    expect(subscription.expiresAt?.getTime()).toBe(
      baseDate.getTime() + 30 * 24 * 60 * 60 * 1000,
    );
    expect(user.subscription).toEqual(subscription);
    expect(user.save).toHaveBeenCalledTimes(1);
  });

  it('marks subscription failed when verification is declined', async () => {
    mockVerify.mockResolvedValue({ data: { code: -21 } });
    const user = new FakeUser('pro@test');

    await expect(
      service.verifyPayment('AUTH-XYZ', 'pro', 'merchant-123', user as any),
    ).rejects.toThrow('Verify failed code=-21');

    expect(user.subscription).toEqual({
      status: 'failed',
      planId: 'pro',
      authority: 'AUTH-XYZ',
      lastReceipt: { data: { code: -21 } },
    });
    expect(user.save).toHaveBeenCalledTimes(1);
  });

  it('proxies inquiry to the gateway', async () => {
    mockInquiry.mockResolvedValue({ data: { code: 100 } });

    const result = await service.inquiry('AUTH-123', 'merchant-123');

    expect(mockInquiry).toHaveBeenCalledWith({
      merchant_id: 'merchant-123',
      authority: 'AUTH-123',
    });
    expect(result).toEqual({ data: { code: 100 } });
  });
});

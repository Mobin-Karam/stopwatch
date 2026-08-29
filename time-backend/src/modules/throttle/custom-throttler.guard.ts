import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return (
      req?.session?.userId ||
      req?.user?.id ||
      req?.ip ||
      req?.headers?.['x-forwarded-for'] ||
      'anonymous'
    );
  }
}

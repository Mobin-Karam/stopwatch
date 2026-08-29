import { Controller, Get, Inject, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { Public } from '../common/guards/public.decorator';
import { metricsRegister } from '../observability/metrics/metrics.registry';
import { REDIS_CLIENT } from '../infrastructure/redis/redis.module';

@Controller()
export class HealthController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject(REDIS_CLIENT) private readonly redis: any,
  ) {}

  @Public()
  @Get('healthz')
  liveness() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      pid: process.pid,
    };
  }

  @Public()
  @Get('readyz')
  async readiness() {
    const mongoReady = this.connection?.readyState === 1;
    let redisReady = false;
    if (this.redis?.ping) {
      try {
        await Promise.race([
          this.redis.ping(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('redis timeout')), 200),
          ),
        ]);
        redisReady = true;
      } catch {
        redisReady = false;
      }
    }
    const metricsExposed = Boolean(metricsRegister);

    const ready = mongoReady && (this.redis ? redisReady : true);
    return {
      status: ready ? 'ok' : 'degraded',
      mongo: mongoReady ? 'ok' : 'down',
      redis: this.redis ? (redisReady ? 'ok' : 'down') : 'not-configured',
      metrics: metricsExposed ? 'ok' : 'unknown',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('metrics')
  async metrics(@Res() res) {
    res.setHeader('Content-Type', metricsRegister.contentType);
    res.end(await metricsRegister.metrics());
  }
}

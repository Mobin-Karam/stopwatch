import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '../../config/config.module';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const url = config.get<string>('redis.url');
        if (!url) return null;
        // Lazy load ioredis to avoid dependency issues in environments without it.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Redis = require('ioredis');
        const client = new Redis(url, {
          lazyConnect: true,
          maxRetriesPerRequest: 3,
        });
        try {
          await client.connect();
        } catch (err) {
          // Fail silently in dev/test; readiness probe will surface connectivity.
          console.warn('Redis connection failed (continuing without Redis):', err);
        }
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}

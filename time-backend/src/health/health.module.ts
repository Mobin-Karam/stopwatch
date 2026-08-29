import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { RedisModule } from '../infrastructure/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}

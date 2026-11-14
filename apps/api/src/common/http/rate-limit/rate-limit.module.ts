import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Redis } from 'ioredis';

import rateLimitConfig from '../../../config/rate-limit/rate-limit';
import { KeyValueStoreModule } from '../../../key-value-store/key-value-store.module';

import { RedisThrottlerStorage } from './adapters/redis-throttler-storage';
import { createRateLimitOptions } from './rate-limit.options';

import type { RateLimitConfig } from '../../../config/rate-limit/rate-limit.types';

/**
 * Applies per-IP rate limits to every HTTP route of the API. Counters live in
 * Redis so all API instances share them.
 */
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(rateLimitConfig), KeyValueStoreModule],
      inject: [ConfigService, Reflector, Redis],
      useFactory: (
        configService: ConfigService<RateLimitConfig, true>,
        reflector: Reflector,
        redis: Redis,
      ) =>
        createRateLimitOptions(
          configService,
          reflector,
          new RedisThrottlerStorage(redis),
        ),
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class RateLimitModule {}

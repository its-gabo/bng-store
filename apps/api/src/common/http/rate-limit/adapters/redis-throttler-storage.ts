import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

import { millisecondsToSeconds } from '../../../utils/date.utils';
import { RATE_LIMIT_KEY_PREFIX } from '../rate-limit.constants';

import { INCREMENT_RATE_LIMIT_HITS_SCRIPT } from './redis-rate-limit.script';

import type { ThrottlerStorage } from '@nestjs/throttler';
import type { Redis } from 'ioredis';

type ThrottlerStorageRecord = Awaited<
  ReturnType<ThrottlerStorage['increment']>
>;

const rateLimitReplySchema = Type.Tuple([
  Type.Integer(),
  Type.Integer(),
  Type.Union([Type.Literal(0), Type.Literal(1)]),
  Type.Integer(),
]);

/**
 * Keeps rate limit counters in Redis, so every API instance enforces the
 * same limits and they survive restarts.
 */
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const keyPrefix = `${RATE_LIMIT_KEY_PREFIX}:${throttlerName}:${key}`;

    const reply = await this.redis.eval(
      INCREMENT_RATE_LIMIT_HITS_SCRIPT,
      2,
      `${keyPrefix}:hits`,
      `${keyPrefix}:block`,
      ttl,
      limit,
      blockDuration,
    );

    if (!Value.Check(rateLimitReplySchema, reply)) {
      throw new Error('Unexpected rate limit reply from Redis');
    }

    const [totalHits, windowRemainingMs, blockedFlag, blockRemainingMs] = reply;

    return {
      totalHits,
      timeToExpire: millisecondsToSeconds(windowRemainingMs),
      isBlocked: blockedFlag === 1,
      timeToBlockExpire: millisecondsToSeconds(blockRemainingMs),
    };
  }
}

import { SECOND_MS } from '../../time/time.constants';

import {
  RATE_LIMITERS,
  SENSITIVE_RATE_LIMIT_METADATA,
} from './rate-limit.constants';

import type { RateLimitConfig } from '../../../config/rate-limit/rate-limit.types';
import type { ExecutionContext } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Reflector } from '@nestjs/core';
import type {
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';

export const createRateLimitOptions = (
  configService: ConfigService<RateLimitConfig, true>,
  reflector: Reflector,
  storage: ThrottlerStorage,
): ThrottlerModuleOptions => {
  const rateLimitConfig = configService.get('rateLimit', { infer: true });

  const isSensitiveRoute = (context: ExecutionContext): boolean =>
    reflector.getAllAndOverride<boolean>(SENSITIVE_RATE_LIMIT_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) ?? false;

  return {
    storage,
    throttlers: [
      {
        name: RATE_LIMITERS.GLOBAL,
        limit: rateLimitConfig.RATE_LIMIT_GLOBAL_LIMIT,
        ttl: rateLimitConfig.RATE_LIMIT_GLOBAL_TTL_SECONDS * SECOND_MS,
      },
      {
        name: RATE_LIMITERS.SENSITIVE,
        limit: rateLimitConfig.RATE_LIMIT_SENSITIVE_LIMIT,
        ttl: rateLimitConfig.RATE_LIMIT_SENSITIVE_TTL_SECONDS * SECOND_MS,
        blockDuration:
          rateLimitConfig.RATE_LIMIT_SENSITIVE_BLOCK_SECONDS * SECOND_MS,
        skipIf: (context) => !isSensitiveRoute(context),
      },
    ],
  };
};

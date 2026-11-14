import { registerAs } from '@nestjs/config';

import { parseIntegerEnv } from '../utils/config-env.parsers';
import { configValidator } from '../utils/config.validator';

import { rateLimitSchema } from './rate-limit.schema';

import type { RateLimitConfigSchema } from './rate-limit.types';

const validateRateLimitConfig = configValidator(rateLimitSchema);

export default registerAs('rateLimit', (): RateLimitConfigSchema => {
  const values = {
    RATE_LIMIT_GLOBAL_LIMIT: parseIntegerEnv(
      process.env.RATE_LIMIT_GLOBAL_LIMIT,
      100,
    ),
    RATE_LIMIT_GLOBAL_TTL_SECONDS: parseIntegerEnv(
      process.env.RATE_LIMIT_GLOBAL_TTL_SECONDS,
      60,
    ),
    RATE_LIMIT_SENSITIVE_LIMIT: parseIntegerEnv(
      process.env.RATE_LIMIT_SENSITIVE_LIMIT,
      10,
    ),
    RATE_LIMIT_SENSITIVE_TTL_SECONDS: parseIntegerEnv(
      process.env.RATE_LIMIT_SENSITIVE_TTL_SECONDS,
      300,
    ),
    RATE_LIMIT_SENSITIVE_BLOCK_SECONDS: parseIntegerEnv(
      process.env.RATE_LIMIT_SENSITIVE_BLOCK_SECONDS,
      900,
    ),
  };

  return validateRateLimitConfig(values);
});

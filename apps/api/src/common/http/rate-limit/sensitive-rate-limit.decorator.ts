import { SetMetadata } from '@nestjs/common';

import { SENSITIVE_RATE_LIMIT_METADATA } from './rate-limit.constants';

/**
 * Adds the strict `sensitive` rate limit (with a temporary block once it is
 * exceeded) on top of the global one. Use it on endpoints that can be abused
 * to guess credentials or tokens, or to send emails.
 */
export const SensitiveRateLimit = () =>
  SetMetadata(SENSITIVE_RATE_LIMIT_METADATA, true);

export const RATE_LIMITERS = {
  GLOBAL: 'global',
  SENSITIVE: 'sensitive',
} as const;

export const RATE_LIMIT_KEY_PREFIX = 'rate-limit';

export const SENSITIVE_RATE_LIMIT_METADATA = 'http:sensitive-rate-limit';

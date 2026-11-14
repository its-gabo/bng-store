import type { rateLimitSchema } from './rate-limit.schema';
import type { Static } from '@sinclair/typebox';

export type RateLimitConfigSchema = Static<typeof rateLimitSchema>;

export type RateLimitConfig = { rateLimit: RateLimitConfigSchema };

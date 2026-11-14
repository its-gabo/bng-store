import { Type } from '@sinclair/typebox';

export const rateLimitSchema = Type.Object({
  RATE_LIMIT_GLOBAL_LIMIT: Type.Integer({ minimum: 1 }),
  RATE_LIMIT_GLOBAL_TTL_SECONDS: Type.Integer({ minimum: 1 }),
  RATE_LIMIT_SENSITIVE_LIMIT: Type.Integer({ minimum: 1 }),
  RATE_LIMIT_SENSITIVE_TTL_SECONDS: Type.Integer({ minimum: 1 }),
  RATE_LIMIT_SENSITIVE_BLOCK_SECONDS: Type.Integer({ minimum: 1 }),
});

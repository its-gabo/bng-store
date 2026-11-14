import { Type } from '@sinclair/typebox';

export const AUTH_COOKIE_SAME_SITE_VALUES = {
  LAX: 'lax',
  STRICT: 'strict',
  NONE: 'none',
} as const;

export const authSchema = Type.Object({
  AUTH_SECRET: Type.String({ minLength: 1 }),
  CORS_ORIGIN: Type.String({ minLength: 1 }),
  AUTH_SESSION_TTL_HOURS: Type.Integer({ minimum: 1 }),
  AUTH_EMAIL_VERIFICATION_TTL_HOURS: Type.Integer({ minimum: 1 }),
  AUTH_PASSWORD_RESET_TTL_MINUTES: Type.Integer({ minimum: 1 }),
  AUTH_COOKIE_NAME: Type.String({ minLength: 1 }),
  AUTH_COOKIE_SECURE: Type.Boolean(),
  AUTH_COOKIE_SAME_SITE: Type.Union([
    Type.Literal(AUTH_COOKIE_SAME_SITE_VALUES.LAX),
    Type.Literal(AUTH_COOKIE_SAME_SITE_VALUES.STRICT),
    Type.Literal(AUTH_COOKIE_SAME_SITE_VALUES.NONE),
  ]),
});

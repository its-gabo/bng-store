import { registerAs } from '@nestjs/config';

import { parseBooleanEnv, parseIntegerEnv } from '../utils/config-env.parsers';
import { configValidator } from '../utils/config.validator';

import { authSchema } from './auth.schema';

import type { AuthConfigSchema } from './auth.types';

const validateAuthConfig = configValidator(authSchema);

export default registerAs('auth', (): AuthConfigSchema => {
  const values = {
    AUTH_SECRET: process.env.AUTH_SECRET ?? '',
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    AUTH_SESSION_TTL_HOURS: parseIntegerEnv(
      process.env.AUTH_SESSION_TTL_HOURS,
      168,
    ),
    AUTH_EMAIL_VERIFICATION_TTL_HOURS: parseIntegerEnv(
      process.env.AUTH_EMAIL_VERIFICATION_TTL_HOURS,
      24,
    ),
    AUTH_PASSWORD_RESET_TTL_MINUTES: parseIntegerEnv(
      process.env.AUTH_PASSWORD_RESET_TTL_MINUTES,
      30,
    ),
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME ?? 'bng_session',
    AUTH_COOKIE_SECURE: parseBooleanEnv(
      process.env.AUTH_COOKIE_SECURE,
      process.env.NODE_ENV === 'production',
    ),
    AUTH_COOKIE_SAME_SITE: process.env.AUTH_COOKIE_SAME_SITE ?? 'lax',
  };

  return validateAuthConfig(values);
});

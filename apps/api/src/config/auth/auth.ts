import { registerAs } from '@nestjs/config';

import { configValidator } from '../config.validator';

import { authSchema } from './auth.schema';

import type { AuthConfigSchema } from './auth.types';

const validateAuthConfig = configValidator(authSchema);

export default registerAs('auth', (): AuthConfigSchema => {
  const values = {
    AUTH_SECRET: process.env.AUTH_SECRET ?? '',
    AUTH_COOKIE_SECURE: process.env.NODE_ENV === 'production',
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  };

  return validateAuthConfig(values);
});

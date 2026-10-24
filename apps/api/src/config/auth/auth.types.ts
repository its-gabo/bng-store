import type { authSchema } from './auth.schema';
import type { Static } from '@sinclair/typebox';

export type AuthConfigSchema = Static<typeof authSchema>;

export type AuthCookieSameSite = AuthConfigSchema['AUTH_COOKIE_SAME_SITE'];

export type AuthConfig = { auth: AuthConfigSchema };

import { Type } from '@sinclair/typebox';

export const authSchema = Type.Object({
  AUTH_SECRET: Type.String({ minLength: 1 }),
  AUTH_COOKIE_SECURE: Type.Boolean(),
  CORS_ORIGIN: Type.String({ minLength: 1 }),
});

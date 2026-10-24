import { Type } from '@sinclair/typebox';

export const emailSchema = Type.Object({
  EMAIL_FROM: Type.String({ minLength: 1 }),
  SMTP_HOST: Type.String({ minLength: 1 }),
  SMTP_PORT: Type.Number({ minimum: 1 }),
});

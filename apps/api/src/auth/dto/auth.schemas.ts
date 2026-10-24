import { Type } from '@sinclair/typebox';

import { createApiSuccessResponseSchema } from '../../common/http/response/response.schemas';

export const authUserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ minLength: 3 }),
  name: Type.String(),
  emailVerified: Type.Boolean(),
});

export const authSignUpBodySchema = Type.Object({
  email: Type.String({ minLength: 3, format: 'email' }),
  password: Type.String({ minLength: 8 }),
  name: Type.String({ minLength: 1 }),
  redirectTo: Type.Optional(Type.String({ minLength: 1, maxLength: 2048 })),
});

export const authSignInBodySchema = Type.Object({
  email: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 8 }),
});

export const authForgotPasswordBodySchema = Type.Object({
  email: Type.String({ minLength: 3 }),
});

export const authResetPasswordBodySchema = Type.Object({
  token: Type.String({ minLength: 1 }),
  password: Type.String({ minLength: 8 }),
});

export const authVerifyEmailQuerySchema = Type.Object({
  token: Type.String({ minLength: 1 }),
});

export const authEmptyDataSchema = Type.Object({});

export const authSignInDataSchema = Type.Object({
  user: authUserSchema,
});

export const authSessionDataSchema = Type.Object({
  authenticated: Type.Boolean(),
  user: Type.Optional(authUserSchema),
});

export const authEmptySuccessResponseSchema =
  createApiSuccessResponseSchema(authEmptyDataSchema);
export const authSignInSuccessResponseSchema =
  createApiSuccessResponseSchema(authSignInDataSchema);
export const authSessionSuccessResponseSchema = createApiSuccessResponseSchema(
  authSessionDataSchema,
);

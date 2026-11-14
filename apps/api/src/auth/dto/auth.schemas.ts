import { Type } from '@sinclair/typebox';

import { createApiSuccessResponseSchema } from '../../common/http/response/response.schemas';
import {
  emailSchema,
  opaqueTokenSchema,
  passwordSchema,
  personNameSchema,
  safeRedirectPathSchema,
  uuidSchema,
} from '../../common/http/validation/validation.schemas';

export const authUserSchema = Type.Object({
  id: uuidSchema,
  email: Type.String({ minLength: 3 }),
  name: Type.String(),
  emailVerified: Type.Boolean(),
});

export const authSignUpBodySchema = Type.Object({
  email: emailSchema,
  password: passwordSchema,
  name: personNameSchema,
  redirectTo: Type.Optional(safeRedirectPathSchema),
});

export const authSignInBodySchema = Type.Object({
  email: emailSchema,
  password: passwordSchema,
});

export const authForgotPasswordBodySchema = Type.Object({
  email: emailSchema,
});

export const authResetPasswordBodySchema = Type.Object({
  token: opaqueTokenSchema,
  password: passwordSchema,
});

export const authVerifyEmailQuerySchema = Type.Object({
  token: opaqueTokenSchema,
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

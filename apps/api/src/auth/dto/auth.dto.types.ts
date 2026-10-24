import type {
  authEmptySuccessResponseSchema,
  authSignInSuccessResponseSchema,
  authSessionSuccessResponseSchema,
  authSessionDataSchema,
  authEmptyDataSchema,
  authSignInDataSchema,
  authForgotPasswordBodySchema,
  authSignUpBodySchema,
  authSignInBodySchema,
  authResetPasswordBodySchema,
  authVerifyEmailQuerySchema,
} from './auth.schemas';
import type { Static } from '@sinclair/typebox';

export type AuthSignUpBody = Static<typeof authSignUpBodySchema>;
export type AuthSignInBody = Static<typeof authSignInBodySchema>;
export type AuthForgotPasswordBody = Static<
  typeof authForgotPasswordBodySchema
>;
export type AuthResetPasswordBody = Static<typeof authResetPasswordBodySchema>;
export type AuthVerifyEmailQuery = Static<typeof authVerifyEmailQuerySchema>;

export type AuthEmptyData = Static<typeof authEmptyDataSchema>;
export type AuthSignInData = Static<typeof authSignInDataSchema>;
export type AuthSessionData = Static<typeof authSessionDataSchema>;

export type AuthEmptySuccessResponse = Static<
  typeof authEmptySuccessResponseSchema
>;
export type AuthSignInSuccessResponse = Static<
  typeof authSignInSuccessResponseSchema
>;
export type AuthSessionSuccessResponse = Static<
  typeof authSessionSuccessResponseSchema
>;

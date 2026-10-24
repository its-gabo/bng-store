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
  authUserSchema,
} from './auth.schemas';
import type { Static, StaticDecode } from '@sinclair/typebox';

export type AuthSignUpBody = StaticDecode<typeof authSignUpBodySchema>;
export type AuthSignInBody = StaticDecode<typeof authSignInBodySchema>;
export type AuthForgotPasswordBody = StaticDecode<
  typeof authForgotPasswordBodySchema
>;
export type AuthResetPasswordBody = StaticDecode<
  typeof authResetPasswordBodySchema
>;
export type AuthVerifyEmailQuery = StaticDecode<
  typeof authVerifyEmailQuerySchema
>;

export type AuthUserDto = Static<typeof authUserSchema>;

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

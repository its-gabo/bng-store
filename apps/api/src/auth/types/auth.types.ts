import type { EmailMessage } from '../../email/email.types';

export type AuthUserSession = {
  userId: string;
  email: string;
  name: string;
  emailVerified: boolean;
  expiresAt: Date;
};

export type AuthRequestMetadata = {
  ipAddress?: string;
  userAgent?: string;
};

export type AuthSignUpInput = {
  email: string;
  password: string;
  name: string;
  redirectTo?: string;
};

export type AuthSignInInput = {
  email: string;
  password: string;
};

export type AuthForgotPasswordInput = {
  email: string;
};

export type AuthResetPasswordInput = {
  token: string;
  password: string;
};

export type AuthTokenRecord = {
  userId: string;
};

export type AuthSessionRecord = {
  userId: string;
  email: string;
  name: string;
  emailVerified: boolean;
  expiresAt: Date;
};

export type AuthSignInResult = {
  sessionToken: string;
  session: AuthUserSession;
};

export type AuthPreparedToken = {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
};

export type CreateUserCredentialAndVerificationTokenParams = {
  email: string;
  name: string;
  passwordHash: string;
  verificationTokenHash: string;
  verificationTokenExpiresAt: Date;
  welcomeEmail: EmailMessage;
};

export type CreateSessionParams = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
};

export type CreatePasswordResetTokenParams = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  resetEmail: EmailMessage;
};

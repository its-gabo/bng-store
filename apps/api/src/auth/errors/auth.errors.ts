import { DOMAIN_ERROR_KINDS } from '../../common/errors/domain-error.constants';

import type { DomainErrorCatalog } from '../../common/errors/domain-error.types';

export const AUTH_ERROR_CODES = {
  USER_ALREADY_EXISTS: 'auth.sign_up.fail',
  INVALID_CREDENTIALS: 'auth.sign_in.fail',
  EMAIL_NOT_VERIFIED: 'auth.sign_in.email_not_verified',
  INVALID_PASSWORD_RESET_TOKEN: 'auth.reset_password.fail',
  INVALID_EMAIL_VERIFICATION_TOKEN: 'auth.verify_email.fail',
  SESSION_REQUIRED: 'auth.unauthorized',
} as const;

export const AUTH_ERRORS = {
  USER_ALREADY_EXISTS: {
    kind: DOMAIN_ERROR_KINDS.CONFLICT,
    code: AUTH_ERROR_CODES.USER_ALREADY_EXISTS,
    message: 'Failed to create user',
    reason: 'auth.user_exists',
  },
  INVALID_CREDENTIALS: {
    kind: DOMAIN_ERROR_KINDS.UNAUTHENTICATED,
    code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    message: 'Failed to sign in',
    reason: 'auth.invalid_credentials',
  },
  EMAIL_NOT_VERIFIED: {
    kind: DOMAIN_ERROR_KINDS.FORBIDDEN,
    code: AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED,
    message: 'Email is not verified',
    reason: 'auth.email_not_verified',
  },
  INVALID_PASSWORD_RESET_TOKEN: {
    kind: DOMAIN_ERROR_KINDS.INVALID_INPUT,
    code: AUTH_ERROR_CODES.INVALID_PASSWORD_RESET_TOKEN,
    message: 'Failed to reset password',
    reason: 'auth.invalid_or_expired_token',
  },
  INVALID_EMAIL_VERIFICATION_TOKEN: {
    kind: DOMAIN_ERROR_KINDS.INVALID_INPUT,
    code: AUTH_ERROR_CODES.INVALID_EMAIL_VERIFICATION_TOKEN,
    message: 'Failed to verify email',
    reason: 'auth.invalid_or_expired_token',
  },
  SESSION_REQUIRED: {
    kind: DOMAIN_ERROR_KINDS.UNAUTHENTICATED,
    code: AUTH_ERROR_CODES.SESSION_REQUIRED,
    message: 'Authentication required',
    reason: 'auth.session_required',
  },
} as const satisfies DomainErrorCatalog<typeof AUTH_ERROR_CODES>;

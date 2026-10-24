import type { ApiResultCatalog } from '../../common/http/response/response.types';

export const AUTH_SUCCESS_CODES = {
  SIGN_UP: 'auth.sign_up.success',
  SIGN_IN: 'auth.sign_in.success',
  SIGN_OUT: 'auth.sign_out.success',
  SESSION: 'auth.session.success',
  FORGOT_PASSWORD: 'auth.forgot_password.success',
  RESET_PASSWORD: 'auth.reset_password.success',
  VERIFY_EMAIL: 'auth.verify_email.success',
} as const;

export const AUTH_SUCCESS_RESULTS = {
  SIGN_UP: { code: AUTH_SUCCESS_CODES.SIGN_UP, message: 'User created' },
  SIGN_IN: { code: AUTH_SUCCESS_CODES.SIGN_IN, message: 'User signed in' },
  SIGN_OUT: { code: AUTH_SUCCESS_CODES.SIGN_OUT, message: 'User signed out' },
  SESSION: { code: AUTH_SUCCESS_CODES.SESSION, message: 'Session fetched' },
  FORGOT_PASSWORD: {
    code: AUTH_SUCCESS_CODES.FORGOT_PASSWORD,
    message: 'Password reset email requested',
  },
  RESET_PASSWORD: {
    code: AUTH_SUCCESS_CODES.RESET_PASSWORD,
    message: 'Password reset',
  },
  VERIFY_EMAIL: {
    code: AUTH_SUCCESS_CODES.VERIFY_EMAIL,
    message: 'Email verified',
  },
} as const satisfies ApiResultCatalog<typeof AUTH_SUCCESS_CODES>;

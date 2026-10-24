export const AUTH_SESSION_COOKIE = {
  HTTP_ONLY: true,
  PATH: '/',
} as const;

export const AUTH_ACTION_PATHS = {
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',
} as const;

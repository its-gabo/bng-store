const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export const AUTH_SETTINGS = {
  SESSION_TTL_MS: 168 * HOUR_MS,
  VERIFY_TOKEN_TTL_MS: 24 * HOUR_MS,
  RESET_TOKEN_TTL_MS: 30 * MINUTE_MS,
  COOKIE_NAME: 'bng_session',
  COOKIE_HTTP_ONLY: true,
  COOKIE_SAME_SITE: 'lax',
} as const;

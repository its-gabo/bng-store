export const OUTBOX_EMAIL_QUEUE = 'outbox.email';

export const RABBITMQ_PREFETCH = 10;

export const RABBITMQ_RECOVERY = {
  INITIAL_DELAY_MS: 500,
  MAX_DELAY_MS: 30_000,
  INITIAL_MAX_RETRIES: 5,
} as const;

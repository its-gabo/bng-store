export const BILLING_PERIODS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const ORDER_KINDS = {
  PURCHASE: 'purchase',
  ADJUSTMENT: 'adjustment',
  RENEWAL: 'renewal',
} as const;

export const ORDER_SELECTIONS = {
  BUNDLE: 'bundle',
  CUSTOM: 'custom',
} as const;

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export const ORDER_REJECTION_REASONS = {
  APPLICATIONS_ALREADY_OWNED: 'applications_already_owned',
  SUBSCRIPTION_NOT_ADJUSTABLE: 'subscription_not_adjustable',
} as const;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export const PAYMENT_PROVIDERS = {
  MOCK: 'mock',
} as const;

export const PAYMENT_STATUSES = {
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export const CURRENCIES = {
  PLN: 'PLN',
} as const;

export const STORE_CRON_JOBS = {
  MAINTENANCE: 'store-maintenance',
} as const;

export const STORE_SETTINGS = {
  CURRENCY: CURRENCIES.PLN,
  MAX_SELECTED_APPLICATIONS: 50,
} as const;

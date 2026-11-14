export const BILLING_PERIODS = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const

export const CHECKOUT_STEPS = {
  SELECTING: "selecting",
  AWAITING_PAYMENT: "awaiting_payment",
  COMPLETED: "completed",
} as const

export const PLAN_CHECKOUT_MODES = {
  PURCHASE: "purchase",
  ADJUSTMENT: "adjustment",
} as const

export const APPLICATION_CARD_STATES = {
  AVAILABLE: "available",
  SELECTED: "selected",
  IN_BUNDLE: "in_bundle",
  OWNED: "owned",
} as const

export const STORE_CATALOG_STALE_TIME_MS = 5 * 60_000

export const MINOR_UNITS_PER_MAJOR_UNIT = 100

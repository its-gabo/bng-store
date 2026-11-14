import type {
  APPLICATION_CARD_STATES,
  BILLING_PERIODS,
  CHECKOUT_STEPS,
  PLAN_CHECKOUT_MODES,
  SUBSCRIPTION_STATUSES,
} from "./store.constants"
import type {
  CheckoutSelectionResponse,
  ConfirmMockPaymentResponse,
  GetCatalogResponse,
  GetMyLicenseKeyResponse,
  ListMySubscriptionsResponse,
  QuoteCustomSelectionResponse,
} from "@/api/generated-api"

type ValueOf<T> = T[keyof T]

export type BillingPeriod = ValueOf<typeof BILLING_PERIODS>
export type SubscriptionStatus = ValueOf<typeof SUBSCRIPTION_STATUSES>
export type ApplicationCardState = ValueOf<typeof APPLICATION_CARD_STATES>

export type StoreCatalog = GetCatalogResponse["data"]
export type StoreApplication = StoreCatalog["applications"][number]
export type StoreBundle = StoreCatalog["bundles"][number]
export type StorePrice = StoreApplication["prices"][number]

export type StoreQuote = QuoteCustomSelectionResponse["data"]
export type SuggestedBundle = NonNullable<StoreQuote["suggestedBundle"]>

export type PendingOrder = CheckoutSelectionResponse["data"]
export type ConfirmedOrder = ConfirmMockPaymentResponse["data"]

export type UserSubscription = ListMySubscriptionsResponse["data"][number]
export type UserLicenseKey = GetMyLicenseKeyResponse["data"]

/**
 * Applications picked in the store. With a bundle chosen, `applicationIds`
 * holds only the extras bought next to it.
 */
export type StoreCart = {
  billingPeriod: BillingPeriod
  bundleId: string | null
  applicationIds: string[]
}

export type CheckoutState =
  | { step: typeof CHECKOUT_STEPS.SELECTING }
  | { step: typeof CHECKOUT_STEPS.AWAITING_PAYMENT; pendingOrder: PendingOrder }
  | { step: typeof CHECKOUT_STEPS.COMPLETED; confirmedOrder: ConfirmedOrder }

/** Buying a new plan, or replacing the selection of an existing subscription. */
export type PlanCheckoutMode =
  | { kind: typeof PLAN_CHECKOUT_MODES.PURCHASE }
  | {
      kind: typeof PLAN_CHECKOUT_MODES.ADJUSTMENT
      subscription: UserSubscription
    }

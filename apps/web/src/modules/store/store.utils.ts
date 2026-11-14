import { P, match } from "ts-pattern"

import {
  APPLICATION_CARD_STATES,
  BILLING_PERIODS,
  MINOR_UNITS_PER_MAJOR_UNIT,
  SUBSCRIPTION_STATUSES,
} from "./store.constants"

import type {
  ApplicationCardState,
  BillingPeriod,
  StoreApplication,
  StoreBundle,
  StoreCart,
  StoreCatalog,
  StorePrice,
  SuggestedBundle,
  UserSubscription,
} from "./store.types"
import type {
  QuoteCustomSelectionBody,
  StoreSelectionBody,
} from "@/api/generated-api"

export function formatMoney(
  amountMinor: number,
  currency: string,
  language: string
) {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
  }).format(amountMinor / MINOR_UNITS_PER_MAJOR_UNIT)
}

export function findPriceForPeriod(
  prices: StorePrice[],
  billingPeriod: BillingPeriod
) {
  return prices.find((price) => price.billingPeriod === billingPeriod)
    ?.amountMinor
}

export function findCartBundle(cart: StoreCart, catalog: StoreCatalog) {
  return catalog.bundles.find(({ id }) => id === cart.bundleId) ?? null
}

export function isCartEmpty(cart: StoreCart) {
  return !cart.bundleId && cart.applicationIds.length === 0
}

export function toStoreSelectionBody(cart: StoreCart): StoreSelectionBody {
  const { billingPeriod, bundleId, applicationIds } = cart

  return match(bundleId)
    .with(P.string, (selectedBundleId) => ({
      billingPeriod,
      bundleId: selectedBundleId,
      extraApplicationIds: applicationIds,
    }))
    .with(null, () => ({ billingPeriod, applicationIds }))
    .exhaustive()
}

/**
 * Display total for a bundle cart: the bundle price plus its extras. The
 * server prices the order again at checkout.
 */
export function calculateBundleCartTotal(
  cart: StoreCart,
  bundle: StoreBundle,
  catalog: StoreCatalog
) {
  const bundleAmountMinor =
    findPriceForPeriod(bundle.prices, cart.billingPeriod) ?? 0

  return catalog.applications
    .filter(({ id }) => cart.applicationIds.includes(id))
    .reduce(
      (total, application) =>
        total +
        (findPriceForPeriod(application.prices, cart.billingPeriod) ?? 0),
      bundleAmountMinor
    )
}

/**
 * Applications in the user's active subscriptions. A subscription being
 * changed is excluded, because its applications are free to pick again.
 */
export function listOwnedApplicationIds(
  subscriptions: UserSubscription[],
  excludedSubscriptionId: string | null = null
) {
  return subscriptions
    .filter(
      ({ id, status }) =>
        status === SUBSCRIPTION_STATUSES.ACTIVE && id !== excludedSubscriptionId
    )
    .flatMap(({ applications }) => applications.map(({ id }) => id))
}

/** Mirrors the API rule: only active monthly subscriptions can change plan. */
export function isSubscriptionAdjustable(subscription: UserSubscription) {
  return (
    subscription.status === SUBSCRIPTION_STATUSES.ACTIVE &&
    subscription.billingPeriod === BILLING_PERIODS.MONTHLY
  )
}

/**
 * Rebuilds a subscription as a cart. A bundle that is no longer sold turns
 * into a custom selection, and applications no longer sold are left out.
 */
export function toSubscriptionCart(
  subscription: UserSubscription,
  catalog: StoreCatalog
): StoreCart {
  const { billingPeriod, bundle, applications } = subscription
  const catalogBundle = catalog.bundles.find(({ id }) => id === bundle?.id)
  const sellableApplicationIds = applications
    .map(({ id }) => id)
    .filter((id) =>
      catalog.applications.some((application) => application.id === id)
    )

  return match(catalogBundle)
    .with(undefined, () => ({
      billingPeriod,
      bundleId: null,
      applicationIds: sellableApplicationIds,
    }))
    .otherwise((sellableBundle) => ({
      billingPeriod,
      bundleId: sellableBundle.id,
      applicationIds: sellableApplicationIds.filter(
        (id) => !sellableBundle.applicationIds.includes(id)
      ),
    }))
}

export function isSameCart(left: StoreCart, right: StoreCart) {
  const sortedLeftIds = [...left.applicationIds].sort()
  const sortedRightIds = [...right.applicationIds].sort()

  return (
    left.billingPeriod === right.billingPeriod &&
    left.bundleId === right.bundleId &&
    sortedLeftIds.length === sortedRightIds.length &&
    sortedLeftIds.every((id, index) => id === sortedRightIds[index])
  )
}

export function bundleIncludesAnyApplication(
  bundle: StoreBundle,
  applicationIds: string[]
) {
  return bundle.applicationIds.some((id) => applicationIds.includes(id))
}

/** Only a custom selection is quoted; a bundle cart is priced from the catalog. */
export function toQuoteSelection(
  cart: StoreCart
): QuoteCustomSelectionBody | null {
  return match(cart)
    .with(
      { bundleId: null, applicationIds: [P.string, ...P.array(P.string)] },
      ({ billingPeriod, applicationIds }) => ({ billingPeriod, applicationIds })
    )
    .otherwise(() => null)
}

/** The quote ignores ownership, so a bundle with an owned application cannot be bought. */
export function findPurchasableSuggestion(
  suggestedBundle: SuggestedBundle | null | undefined,
  catalog: StoreCatalog,
  ownedApplicationIds: string[]
) {
  const bundle = catalog.bundles.find(
    ({ id }) => id === suggestedBundle?.bundleId
  )

  return match({ suggestedBundle, bundle })
    .with(
      {
        suggestedBundle: P.nonNullable,
        bundle: P.when(
          (candidate) =>
            candidate !== undefined &&
            !bundleIncludesAnyApplication(candidate, ownedApplicationIds)
        ),
      },
      ({ suggestedBundle: purchasableSuggestion }) => purchasableSuggestion
    )
    .otherwise(() => null)
}

export function resolveApplicationCardState(
  application: StoreApplication,
  context: {
    cart: StoreCart
    cartBundle: StoreBundle | null
    ownedApplicationIds: string[]
  }
): ApplicationCardState {
  const { cart, cartBundle, ownedApplicationIds } = context

  return match({
    isOwned: ownedApplicationIds.includes(application.id),
    isInCartBundle: Boolean(
      cartBundle?.applicationIds.includes(application.id)
    ),
    isInCart: cart.applicationIds.includes(application.id),
  })
    .with({ isOwned: true }, () => APPLICATION_CARD_STATES.OWNED)
    .with({ isInCartBundle: true }, () => APPLICATION_CARD_STATES.IN_BUNDLE)
    .with({ isInCart: true }, () => APPLICATION_CARD_STATES.SELECTED)
    .otherwise(() => APPLICATION_CARD_STATES.AVAILABLE)
}

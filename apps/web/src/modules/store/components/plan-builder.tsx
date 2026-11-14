import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { useStoreCart } from "../hooks/use-store-cart"
import {
  BILLING_PERIODS,
  CHECKOUT_STEPS,
  PLAN_CHECKOUT_MODES,
} from "../store.constants"
import {
  bundleIncludesAnyApplication,
  calculateBundleCartTotal,
  findCartBundle,
  findPurchasableSuggestion,
  isSameCart,
  listOwnedApplicationIds,
  resolveApplicationCardState,
  toQuoteSelection,
  toStoreSelectionBody,
} from "../store.utils"
import { ApplicationCard } from "./application-card"
import { BillingPeriodSwitch } from "./billing-period-switch"
import { BundleCard } from "./bundle-card"
import { CartSummary } from "./cart-summary"
import { MockPaymentStep } from "./mock-payment-step"
import { OrderCompletedStep } from "./order-completed-step"

import type {
  CheckoutState,
  PendingOrder,
  PlanCheckoutMode,
  StoreCart,
  StoreCatalog,
} from "../store.types"

import { useRequestSubscriptionAdjustmentMutation } from "@/api/mutations/store/useRequestSubscriptionAdjustmentMutation"
import { useStoreCheckoutMutation } from "@/api/mutations/store/useStoreCheckoutMutation"
import { useStoreConfirmMockPaymentMutation } from "@/api/mutations/store/useStoreConfirmMockPaymentMutation"
import { useMySubscriptionsQuery } from "@/api/queries/store/useMySubscriptionsQuery"
import { useStoreQuoteQuery } from "@/api/queries/store/useStoreQuoteQuery"

type PlanBuilderProps = {
  catalog: StoreCatalog
  checkoutMode: PlanCheckoutMode
  initialCart?: StoreCart
}

/**
 * Picks applications or a bundle and takes the selection through the mock
 * payment, either as a new purchase or as a change of an existing plan.
 */
export function PlanBuilder({
  catalog,
  checkoutMode,
  initialCart,
}: PlanBuilderProps) {
  const { t } = useTranslation()
  const {
    cart,
    toggleApplication,
    toggleBundle,
    changeBillingPeriod,
    switchToSuggestedBundle,
    clearCart,
  } = useStoreCart(initialCart)
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: CHECKOUT_STEPS.SELECTING,
  })

  const changedSubscription = match(checkoutMode)
    .with(
      { kind: PLAN_CHECKOUT_MODES.ADJUSTMENT },
      ({ subscription }) => subscription
    )
    .with({ kind: PLAN_CHECKOUT_MODES.PURCHASE }, () => null)
    .exhaustive()

  const { data: subscriptions = [] } = useMySubscriptionsQuery()
  const ownedApplicationIds = listOwnedApplicationIds(
    subscriptions,
    changedSubscription?.id ?? null
  )
  const isCartUnchanged = Boolean(initialCart && isSameCart(cart, initialCart))

  const cartBundle = findCartBundle(cart, catalog)
  const { data: quote } = useStoreQuoteQuery(toQuoteSelection(cart))
  const suggestedBundle = findPurchasableSuggestion(
    quote?.suggestedBundle,
    catalog,
    ownedApplicationIds
  )

  const totalAmountMinor = match(cartBundle)
    .with(null, () => quote?.totalAmountMinor ?? null)
    .otherwise((bundle) => calculateBundleCartTotal(cart, bundle, catalog))

  const showMockPayment = (pendingOrder: PendingOrder) => {
    setCheckoutState({ step: CHECKOUT_STEPS.AWAITING_PAYMENT, pendingOrder })
  }

  const { mutate: checkoutSelection, isPending: isCheckoutPending } =
    useStoreCheckoutMutation({ onSuccess: showMockPayment })

  const { mutate: requestAdjustment, isPending: isAdjustmentPending } =
    useRequestSubscriptionAdjustmentMutation({ onSuccess: showMockPayment })

  const placeOrderForCart = () => {
    const selection = toStoreSelectionBody(cart)

    match(checkoutMode)
      .with({ kind: PLAN_CHECKOUT_MODES.PURCHASE }, () =>
        checkoutSelection(selection)
      )
      .with({ kind: PLAN_CHECKOUT_MODES.ADJUSTMENT }, ({ subscription }) =>
        requestAdjustment({ subscriptionId: subscription.id, selection })
      )
      .exhaustive()
  }

  const { mutate: confirmMockPayment, isPending: isPaymentPending } =
    useStoreConfirmMockPaymentMutation({
      onSuccess: (confirmedOrder) => {
        if (!changedSubscription) clearCart()
        setCheckoutState({ step: CHECKOUT_STEPS.COMPLETED, confirmedOrder })
      },
    })

  const returnToSelecting = () => {
    setCheckoutState({ step: CHECKOUT_STEPS.SELECTING })
  }

  const isCartLocked = checkoutState.step !== CHECKOUT_STEPS.SELECTING

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="space-y-8">
        <BillingPeriodSwitch
          billingPeriod={cart.billingPeriod}
          disabled={isCartLocked}
          onBillingPeriodChange={changeBillingPeriod}
        />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            {t("pages.store.bundles_title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {catalog.bundles.map((bundle) => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                applications={catalog.applications}
                currency={catalog.currency}
                billingPeriod={cart.billingPeriod}
                isSelected={cart.bundleId === bundle.id}
                includesOwnedApplication={bundleIncludesAnyApplication(
                  bundle,
                  ownedApplicationIds
                )}
                disabled={isCartLocked}
                onToggle={() => toggleBundle(bundle)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            {t("pages.store.applications_title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {catalog.applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                currency={catalog.currency}
                billingPeriod={cart.billingPeriod}
                state={resolveApplicationCardState(application, {
                  cart,
                  cartBundle,
                  ownedApplicationIds,
                })}
                disabled={isCartLocked}
                onToggle={() => toggleApplication(application.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle>
            {match(checkoutState.step)
              .with(CHECKOUT_STEPS.SELECTING, () =>
                match(checkoutMode.kind)
                  .with(PLAN_CHECKOUT_MODES.PURCHASE, () =>
                    t("pages.store.cart.title")
                  )
                  .with(PLAN_CHECKOUT_MODES.ADJUSTMENT, () =>
                    t("pages.change_plan.cart_title")
                  )
                  .exhaustive()
              )
              .with(CHECKOUT_STEPS.AWAITING_PAYMENT, () =>
                t("pages.store.payment.title")
              )
              .with(CHECKOUT_STEPS.COMPLETED, () =>
                t("pages.store.completed.title")
              )
              .exhaustive()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {match(checkoutState)
            .with({ step: CHECKOUT_STEPS.SELECTING }, () => (
              <CartSummary
                catalog={catalog}
                cart={cart}
                totalAmountMinor={totalAmountMinor}
                suggestedBundle={suggestedBundle}
                checkoutLabel={match(checkoutMode.kind)
                  .with(PLAN_CHECKOUT_MODES.PURCHASE, () =>
                    t("pages.store.cart.checkout")
                  )
                  .with(PLAN_CHECKOUT_MODES.ADJUSTMENT, () =>
                    t("pages.change_plan.checkout")
                  )
                  .exhaustive()}
                notice={match({
                  changedSubscription,
                  isCartUnchanged,
                  billingPeriod: cart.billingPeriod,
                })
                  .with({ changedSubscription: null }, () => null)
                  .with({ isCartUnchanged: true }, () =>
                    t("pages.change_plan.unchanged_notice")
                  )
                  .with({ billingPeriod: BILLING_PERIODS.YEARLY }, () =>
                    t("pages.change_plan.yearly_notice")
                  )
                  .otherwise(() => t("pages.change_plan.new_period_notice"))}
                isCheckoutPending={isCheckoutPending || isAdjustmentPending}
                isCheckoutBlocked={isCartUnchanged}
                onRemoveBundle={() => cartBundle && toggleBundle(cartBundle)}
                onRemoveApplication={toggleApplication}
                onSwitchToSuggestedBundle={switchToSuggestedBundle}
                onCheckout={placeOrderForCart}
              />
            ))
            .with(
              { step: CHECKOUT_STEPS.AWAITING_PAYMENT },
              ({ pendingOrder }) => (
                <MockPaymentStep
                  pendingOrder={pendingOrder}
                  isPaymentPending={isPaymentPending}
                  onConfirmPayment={() =>
                    confirmMockPayment(pendingOrder.paymentReference)
                  }
                  onBackToCart={returnToSelecting}
                />
              )
            )
            .with({ step: CHECKOUT_STEPS.COMPLETED }, ({ confirmedOrder }) => (
              <OrderCompletedStep
                checkoutMode={checkoutMode}
                confirmedOrder={confirmedOrder}
                onContinueShopping={returnToSelecting}
              />
            ))
            .exhaustive()}
        </CardContent>
      </Card>
    </div>
  )
}

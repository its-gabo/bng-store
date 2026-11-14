import { Button } from "@workspace/ui/components/button"
import { ArrowRightIcon, LoaderCircleIcon, XIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { findCartBundle, findPriceForPeriod, isCartEmpty } from "../store.utils"
import { BundleSuggestionAlert } from "./bundle-suggestion-alert"
import { PricePerPeriod } from "./price-per-period"

import type { StoreCart, StoreCatalog, SuggestedBundle } from "../store.types"

type CartSummaryProps = {
  catalog: StoreCatalog
  cart: StoreCart
  totalAmountMinor: number | null
  suggestedBundle: SuggestedBundle | null
  checkoutLabel: string
  notice: string | null
  isCheckoutPending: boolean
  isCheckoutBlocked: boolean
  onRemoveBundle: () => void
  onRemoveApplication: (applicationId: string) => void
  onSwitchToSuggestedBundle: (suggestedBundle: SuggestedBundle) => void
  onCheckout: () => void
}

export function CartSummary({
  catalog,
  cart,
  totalAmountMinor,
  suggestedBundle,
  checkoutLabel,
  notice,
  isCheckoutPending,
  isCheckoutBlocked,
  onRemoveBundle,
  onRemoveApplication,
  onSwitchToSuggestedBundle,
  onCheckout,
}: CartSummaryProps) {
  const { t } = useTranslation()
  const bundle = findCartBundle(cart, catalog)
  const cartApplications = catalog.applications.filter(({ id }) =>
    cart.applicationIds.includes(id)
  )

  if (isCartEmpty(cart)) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("pages.store.cart.empty")}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {bundle && (
          <CartLine
            name={t("pages.store.cart.bundle_line", { bundle: bundle.name })}
            amountMinor={findPriceForPeriod(bundle.prices, cart.billingPeriod)}
            cart={cart}
            currency={catalog.currency}
            removeLabel={t("pages.store.cart.remove", { name: bundle.name })}
            onRemove={onRemoveBundle}
          />
        )}
        {cartApplications.map((application) => (
          <CartLine
            key={application.id}
            name={application.name}
            amountMinor={findPriceForPeriod(
              application.prices,
              cart.billingPeriod
            )}
            cart={cart}
            currency={catalog.currency}
            removeLabel={t("pages.store.cart.remove", {
              name: application.name,
            })}
            onRemove={() => onRemoveApplication(application.id)}
          />
        ))}
      </ul>

      {suggestedBundle && (
        <BundleSuggestionAlert
          suggestedBundle={suggestedBundle}
          applications={catalog.applications}
          currency={catalog.currency}
          disabled={isCheckoutPending}
          onSwitchToBundle={() => onSwitchToSuggestedBundle(suggestedBundle)}
        />
      )}

      <div className="flex items-center justify-between border-t pt-4 text-sm">
        <span className="font-medium">{t("pages.store.cart.total")}</span>
        {totalAmountMinor !== null && (
          <PricePerPeriod
            amountMinor={totalAmountMinor}
            currency={catalog.currency}
            billingPeriod={cart.billingPeriod}
          />
        )}
      </div>

      {notice && <p className="text-xs text-muted-foreground">{notice}</p>}

      <Button
        className="w-full"
        size="lg"
        disabled={isCheckoutPending || isCheckoutBlocked}
        onClick={onCheckout}
      >
        {checkoutLabel}
        {match(isCheckoutPending)
          .with(true, () => (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ))
          .with(false, () => <ArrowRightIcon className="size-4" />)
          .exhaustive()}
      </Button>
    </div>
  )
}

type CartLineProps = {
  name: string
  amountMinor: number | undefined
  cart: StoreCart
  currency: string
  removeLabel: string
  onRemove: () => void
}

function CartLine({
  name,
  amountMinor,
  cart,
  currency,
  removeLabel,
  onRemove,
}: CartLineProps) {
  return (
    <li className="flex items-center justify-between gap-2 text-sm">
      <span className="min-w-0 truncate">{name}</span>
      <span className="flex items-center gap-1 text-xs">
        {amountMinor !== undefined && (
          <PricePerPeriod
            amountMinor={amountMinor}
            currency={currency}
            billingPeriod={cart.billingPeriod}
          />
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      </span>
    </li>
  )
}

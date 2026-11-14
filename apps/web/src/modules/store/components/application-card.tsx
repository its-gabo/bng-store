import { cn } from "@workspace/ui/lib/utils"
import { CheckIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { APPLICATION_CARD_STATES } from "../store.constants"
import { findPriceForPeriod } from "../store.utils"
import { PricePerPeriod } from "./price-per-period"

import type {
  ApplicationCardState,
  BillingPeriod,
  StoreApplication,
} from "../store.types"

type ApplicationCardProps = {
  application: StoreApplication
  currency: string
  billingPeriod: BillingPeriod
  state: ApplicationCardState
  disabled?: boolean
  onToggle: () => void
}

export function ApplicationCard({
  application,
  currency,
  billingPeriod,
  state,
  disabled,
  onToggle,
}: ApplicationCardProps) {
  const { t } = useTranslation()
  const amountMinor = findPriceForPeriod(application.prices, billingPeriod)
  const isSelectable =
    state === APPLICATION_CARD_STATES.AVAILABLE ||
    state === APPLICATION_CARD_STATES.SELECTED

  return (
    <button
      type="button"
      aria-pressed={state === APPLICATION_CARD_STATES.SELECTED}
      disabled={disabled || !isSelectable}
      onClick={onToggle}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl bg-card p-4 text-left text-sm ring-1 ring-foreground/10 transition-all outline-none hover:ring-foreground/30 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:hover:ring-foreground/10",
        state === APPLICATION_CARD_STATES.SELECTED &&
          "ring-2 ring-primary hover:ring-primary",
        !isSelectable && "bg-muted/40"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-foreground">{application.name}</span>
        <span
          className={cn(
            "inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border",
            state === APPLICATION_CARD_STATES.SELECTED &&
              "border-primary bg-primary text-primary-foreground"
          )}
        >
          {state === APPLICATION_CARD_STATES.SELECTED && (
            <CheckIcon className="size-3" />
          )}
        </span>
      </div>
      <p className="flex-1 text-muted-foreground">{application.description}</p>
      <div className="text-xs">
        {match(state)
          .with(
            APPLICATION_CARD_STATES.AVAILABLE,
            APPLICATION_CARD_STATES.SELECTED,
            () =>
              amountMinor !== undefined && (
                <PricePerPeriod
                  amountMinor={amountMinor}
                  currency={currency}
                  billingPeriod={billingPeriod}
                />
              )
          )
          .with(APPLICATION_CARD_STATES.IN_BUNDLE, () => (
            <span className="font-medium text-primary">
              {t("pages.store.application.in_bundle")}
            </span>
          ))
          .with(APPLICATION_CARD_STATES.OWNED, () => (
            <span className="font-medium text-muted-foreground">
              {t("pages.store.application.owned")}
            </span>
          ))
          .exhaustive()}
      </div>
    </button>
  )
}

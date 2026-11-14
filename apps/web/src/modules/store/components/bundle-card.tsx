import { cn } from "@workspace/ui/lib/utils"
import { CheckIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { P, match } from "ts-pattern"

import { findPriceForPeriod } from "../store.utils"
import { PricePerPeriod } from "./price-per-period"

import type {
  BillingPeriod,
  StoreApplication,
  StoreBundle,
} from "../store.types"

type BundleCardProps = {
  bundle: StoreBundle
  applications: StoreApplication[]
  currency: string
  billingPeriod: BillingPeriod
  isSelected: boolean
  includesOwnedApplication: boolean
  disabled?: boolean
  onToggle: () => void
}

export function BundleCard({
  bundle,
  applications,
  currency,
  billingPeriod,
  isSelected,
  includesOwnedApplication,
  disabled,
  onToggle,
}: BundleCardProps) {
  const { t } = useTranslation()
  const amountMinor = findPriceForPeriod(bundle.prices, billingPeriod)
  const bundleApplicationNames = applications
    .filter(({ id }) => bundle.applicationIds.includes(id))
    .map(({ name }) => name)

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled || includesOwnedApplication}
      onClick={onToggle}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl bg-card p-4 text-left text-sm ring-1 ring-foreground/10 transition-all outline-none hover:ring-foreground/30 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:hover:ring-foreground/10",
        isSelected && "ring-2 ring-primary hover:ring-primary"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="font-medium text-foreground">{bundle.name}</span>
          <p className="text-xs text-muted-foreground">
            {t("pages.store.bundle.application_count", {
              count: bundle.applicationIds.length,
            })}
          </p>
        </div>
        {isSelected && (
          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon className="size-3" />
          </span>
        )}
      </div>
      <p className="text-muted-foreground">{bundle.description}</p>
      <p className="flex-1 text-xs text-muted-foreground">
        {bundleApplicationNames.join(" · ")}
      </p>
      <div className="text-xs">
        {match({ includesOwnedApplication, amountMinor })
          .with({ includesOwnedApplication: true }, () => (
            <span className="font-medium text-muted-foreground">
              {t("pages.store.bundle.includes_owned")}
            </span>
          ))
          .with(
            { amountMinor: P.number },
            ({ amountMinor: bundleAmountMinor }) => (
              <PricePerPeriod
                amountMinor={bundleAmountMinor}
                currency={currency}
                billingPeriod={billingPeriod}
              />
            )
          )
          .otherwise(() => null)}
      </div>
    </button>
  )
}

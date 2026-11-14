import { Button } from "@workspace/ui/components/button"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { BILLING_PERIODS } from "../store.constants"

import type { BillingPeriod } from "../store.types"

type BillingPeriodSwitchProps = {
  billingPeriod: BillingPeriod
  disabled?: boolean
  onBillingPeriodChange: (billingPeriod: BillingPeriod) => void
}

export function BillingPeriodSwitch({
  billingPeriod,
  disabled,
  onBillingPeriodChange,
}: BillingPeriodSwitchProps) {
  const { t } = useTranslation()

  return (
    <div
      role="radiogroup"
      aria-label={t("pages.store.billing_period.label")}
      className="inline-flex gap-1 rounded-4xl bg-muted p-1"
    >
      {Object.values(BILLING_PERIODS).map((period) => (
        <Button
          key={period}
          role="radio"
          aria-checked={billingPeriod === period}
          size="sm"
          variant={match(billingPeriod === period)
            .with(true, () => "default" as const)
            .with(false, () => "ghost" as const)
            .exhaustive()}
          disabled={disabled}
          onClick={() => onBillingPeriodChange(period)}
        >
          {match(period)
            .with(BILLING_PERIODS.MONTHLY, () =>
              t("pages.store.billing_period.monthly")
            )
            .with(BILLING_PERIODS.YEARLY, () =>
              t("pages.store.billing_period.yearly")
            )
            .exhaustive()}
        </Button>
      ))}
    </div>
  )
}

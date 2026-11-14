import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { BILLING_PERIODS } from "../store.constants"
import { formatMoney } from "../store.utils"

import type { BillingPeriod } from "../store.types"

type PricePerPeriodProps = {
  amountMinor: number
  currency: string
  billingPeriod: BillingPeriod
}

export function PricePerPeriod({
  amountMinor,
  currency,
  billingPeriod,
}: PricePerPeriodProps) {
  const { t, i18n } = useTranslation()

  return (
    <span className="whitespace-nowrap">
      <span className="font-semibold text-foreground">
        {formatMoney(amountMinor, currency, i18n.language)}
      </span>
      <span className="text-muted-foreground">
        {match(billingPeriod)
          .with(BILLING_PERIODS.MONTHLY, () => t("pages.store.per_month"))
          .with(BILLING_PERIODS.YEARLY, () => t("pages.store.per_year"))
          .exhaustive()}
      </span>
    </span>
  )
}

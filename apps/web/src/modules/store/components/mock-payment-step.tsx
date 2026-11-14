import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { CreditCardIcon, LoaderCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { formatMoney } from "../store.utils"

import type { PendingOrder } from "../store.types"

type MockPaymentStepProps = {
  pendingOrder: PendingOrder
  isPaymentPending: boolean
  onConfirmPayment: () => void
  onBackToCart: () => void
}

export function MockPaymentStep({
  pendingOrder,
  isPaymentPending,
  onConfirmPayment,
  onBackToCart,
}: MockPaymentStepProps) {
  const { t, i18n } = useTranslation()
  const amount = formatMoney(
    pendingOrder.totalAmountMinor,
    pendingOrder.currency,
    i18n.language
  )

  return (
    <div className="space-y-4">
      <Alert>
        <CreditCardIcon />
        <AlertDescription>
          {t("pages.store.payment.description", {
            expiresAt: new Date(pendingOrder.expiresAt).toLocaleTimeString(
              i18n.language,
              { hour: "2-digit", minute: "2-digit" }
            ),
          })}
        </AlertDescription>
      </Alert>
      <Button
        className="w-full"
        size="lg"
        disabled={isPaymentPending}
        onClick={onConfirmPayment}
      >
        {t("pages.store.payment.pay", { amount })}
        {match(isPaymentPending)
          .with(true, () => (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ))
          .with(false, () => null)
          .exhaustive()}
      </Button>
      <Button
        className="w-full"
        variant="ghost"
        disabled={isPaymentPending}
        onClick={onBackToCart}
      >
        {t("pages.store.payment.back")}
      </Button>
    </div>
  )
}

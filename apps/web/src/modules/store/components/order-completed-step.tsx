import { Link } from "@tanstack/react-router"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { CircleCheckIcon, KeyRoundIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { P, match } from "ts-pattern"

import { PLAN_CHECKOUT_MODES } from "../store.constants"

import type { ConfirmedOrder, PlanCheckoutMode } from "../store.types"

type OrderCompletedStepProps = {
  checkoutMode: PlanCheckoutMode
  confirmedOrder: ConfirmedOrder
  onContinueShopping: () => void
}

export function OrderCompletedStep({
  checkoutMode,
  confirmedOrder,
  onContinueShopping,
}: OrderCompletedStepProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {match({ kind: checkoutMode.kind, licenseKey: confirmedOrder.licenseKey })
        .with({ kind: PLAN_CHECKOUT_MODES.ADJUSTMENT }, () => (
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>{t("pages.change_plan.completed_title")}</AlertTitle>
            <AlertDescription>
              {t("pages.change_plan.completed_description")}
            </AlertDescription>
          </Alert>
        ))
        .with({ licenseKey: P.string }, ({ licenseKey }) => (
          <Alert>
            <KeyRoundIcon />
            <AlertTitle>{t("pages.store.completed.new_key_title")}</AlertTitle>
            <AlertDescription className="space-y-2">
              <code className="block rounded-lg bg-muted px-3 py-2 font-mono text-sm break-all text-foreground select-all">
                {licenseKey}
              </code>
              <p>{t("pages.store.completed.new_key_description")}</p>
            </AlertDescription>
          </Alert>
        ))
        .with({ licenseKey: null }, () => (
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>
              {t("pages.store.completed.existing_key_title")}
            </AlertTitle>
            <AlertDescription>
              {t("pages.store.completed.existing_key_description")}
            </AlertDescription>
          </Alert>
        ))
        .exhaustive()}
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          render={<Link to="/account" />}
          nativeButton={false}
        >
          {t("pages.store.completed.go_to_account")}
        </Button>
        {checkoutMode.kind === PLAN_CHECKOUT_MODES.PURCHASE && (
          <Button
            className="w-full"
            variant="ghost"
            onClick={onContinueShopping}
          >
            {t("pages.store.completed.continue_shopping")}
          </Button>
        )}
      </div>
    </div>
  )
}

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Link } from "@tanstack/react-router"
import { LoaderCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { BILLING_PERIODS, SUBSCRIPTION_STATUSES } from "../store.constants"
import { isSubscriptionAdjustable } from "../store.utils"

import type { UserSubscription } from "../store.types"

import { useCancelMySubscriptionMutation } from "@/api/mutations/store/useCancelMySubscriptionMutation"

type SubscriptionCardProps = {
  subscription: UserSubscription
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const { t, i18n } = useTranslation()
  const { mutate: cancelSubscription, isPending: isCancelPending } =
    useCancelMySubscriptionMutation()

  const periodEnd = new Date(subscription.currentPeriodEnd).toLocaleDateString(
    i18n.language
  )
  const isActive = subscription.status === SUBSCRIPTION_STATUSES.ACTIVE
  const canCancel = isActive && !subscription.cancelAtPeriodEnd
  const canChangePlan = isSubscriptionAdjustable(subscription)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {subscription.bundle?.name ?? t("pages.account.subscription.custom")}
        </CardTitle>
        <CardDescription>
          {match(subscription.billingPeriod)
            .with(BILLING_PERIODS.MONTHLY, () =>
              t("pages.store.billing_period.monthly")
            )
            .with(BILLING_PERIODS.YEARLY, () =>
              t("pages.store.billing_period.yearly")
            )
            .exhaustive()}
          {" · "}
          {match({
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          })
            .with(
              { status: SUBSCRIPTION_STATUSES.ACTIVE, cancelAtPeriodEnd: true },
              () => t("pages.account.subscription.ends_on", { date: periodEnd })
            )
            .with({ status: SUBSCRIPTION_STATUSES.ACTIVE }, () =>
              t("pages.account.subscription.renews_on", { date: periodEnd })
            )
            .with({ status: SUBSCRIPTION_STATUSES.CANCELLED }, () =>
              t("pages.account.subscription.cancelled")
            )
            .with({ status: SUBSCRIPTION_STATUSES.EXPIRED }, () =>
              t("pages.account.subscription.expired")
            )
            .exhaustive()}
        </CardDescription>
        {(canChangePlan || canCancel) && (
          <CardAction className="flex flex-wrap justify-end gap-2">
            {canChangePlan && (
              <Button
                size="sm"
                render={
                  <Link
                    to="/subscriptions/$subscriptionId/change"
                    params={{ subscriptionId: subscription.id }}
                  />
                }
                nativeButton={false}
              >
                {t("pages.account.subscription.change_plan")}
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                disabled={isCancelPending}
                onClick={() => cancelSubscription(subscription.id)}
              >
                {t("pages.account.subscription.cancel")}
                {isCancelPending && (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                )}
              </Button>
            )}
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap gap-2">
          {subscription.applications.map((application) => (
            <li
              key={application.id}
              className={cn(
                "rounded-4xl bg-muted px-2.5 py-1 text-xs font-medium",
                !isActive && "text-muted-foreground"
              )}
            >
              {application.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

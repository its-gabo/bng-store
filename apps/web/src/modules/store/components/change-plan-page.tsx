import { Link } from "@tanstack/react-router"
import { LoaderCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { P, match } from "ts-pattern"

import { PLAN_CHECKOUT_MODES } from "../store.constants"
import { isSubscriptionAdjustable, toSubscriptionCart } from "../store.utils"
import { PlanBuilder } from "./plan-builder"

import { useMySubscriptionsQuery } from "@/api/queries/store/useMySubscriptionsQuery"
import { useStoreCatalogQuery } from "@/api/queries/store/useStoreCatalogQuery"

type ChangePlanPageProps = {
  subscriptionId: string
}

export function ChangePlanPage({ subscriptionId }: ChangePlanPageProps) {
  const { t } = useTranslation()
  const { data: catalog, isPending: isCatalogPending } = useStoreCatalogQuery()
  const { data: subscriptions, isPending: isSubscriptionsPending } =
    useMySubscriptionsQuery()

  const subscription = subscriptions?.find(({ id }) => id === subscriptionId)
  const isAdjustable = Boolean(
    subscription && isSubscriptionAdjustable(subscription)
  )

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link
          to="/account"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("pages.change_plan.back_to_account")}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pages.change_plan.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("pages.change_plan.description", {
            plan:
              subscription?.bundle?.name ??
              t("pages.account.subscription.custom"),
          })}
        </p>
      </div>
      {match({
        isPending: isCatalogPending || isSubscriptionsPending,
        catalog,
        subscription,
        isAdjustable,
      })
        .with({ isPending: true }, () => (
          <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
        ))
        .with({ catalog: undefined }, () => (
          <p className="text-sm text-destructive">
            {t("pages.store.catalog_unavailable")}
          </p>
        ))
        .with({ subscription: undefined }, () => (
          <p className="text-sm text-muted-foreground">
            {t("pages.change_plan.not_found")}
          </p>
        ))
        .with(
          {
            catalog: P.nonNullable,
            subscription: P.nonNullable,
            isAdjustable: true,
          },
          ({
            catalog: loadedCatalog,
            subscription: adjustableSubscription,
          }) => (
            <PlanBuilder
              key={adjustableSubscription.id}
              catalog={loadedCatalog}
              checkoutMode={{
                kind: PLAN_CHECKOUT_MODES.ADJUSTMENT,
                subscription: adjustableSubscription,
              }}
              initialCart={toSubscriptionCart(
                adjustableSubscription,
                loadedCatalog
              )}
            />
          )
        )
        .otherwise(() => (
          <p className="text-sm text-muted-foreground">
            {t("pages.change_plan.not_adjustable")}
          </p>
        ))}
    </div>
  )
}

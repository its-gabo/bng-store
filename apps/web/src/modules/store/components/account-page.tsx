import { Link } from "@tanstack/react-router"
import { LoaderCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { LicenseKeyCard } from "./license-key-card"
import { SubscriptionCard } from "./subscription-card"

import { useMySubscriptionsQuery } from "@/api/queries/store/useMySubscriptionsQuery"

export function AccountPage() {
  const { t } = useTranslation()
  const { data: subscriptions, isPending } = useMySubscriptionsQuery()

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pages.account.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("pages.account.description")}
        </p>
      </div>

      <LicenseKeyCard />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {t("pages.account.subscriptions_title")}
        </h2>
        {match({ subscriptions, isPending })
          .with({ isPending: true }, () => (
            <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
          ))
          .with({ subscriptions: [] }, { subscriptions: undefined }, () => (
            <p className="text-sm text-muted-foreground">
              {t("pages.account.no_subscriptions")}{" "}
              <Link
                to="/"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {t("pages.account.browse_store")}
              </Link>
            </p>
          ))
          .otherwise(({ subscriptions: userSubscriptions = [] }) => (
            <div className="space-y-4">
              {userSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>
          ))}
      </section>
    </div>
  )
}

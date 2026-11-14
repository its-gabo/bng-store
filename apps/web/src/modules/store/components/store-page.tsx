import { LoaderCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { P, match } from "ts-pattern"

import { PLAN_CHECKOUT_MODES } from "../store.constants"
import { PlanBuilder } from "./plan-builder"

import { useStoreCatalogQuery } from "@/api/queries/store/useStoreCatalogQuery"

export function StorePage() {
  const { t } = useTranslation()
  const { data: catalog, isPending: isCatalogPending } = useStoreCatalogQuery()

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pages.store.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("pages.store.description")}
        </p>
      </div>
      {match({ catalog, isCatalogPending })
        .with({ isCatalogPending: true }, () => (
          <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
        ))
        .with({ catalog: P.nonNullable }, ({ catalog: loadedCatalog }) => (
          <PlanBuilder
            catalog={loadedCatalog}
            checkoutMode={{ kind: PLAN_CHECKOUT_MODES.PURCHASE }}
          />
        ))
        .otherwise(() => (
          <p className="text-sm text-destructive">
            {t("pages.store.catalog_unavailable")}
          </p>
        ))}
    </div>
  )
}

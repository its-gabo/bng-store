import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { SparklesIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { P, match } from "ts-pattern"

import { formatMoney } from "../store.utils"

import type { StoreApplication, SuggestedBundle } from "../store.types"

type BundleSuggestionAlertProps = {
  suggestedBundle: SuggestedBundle
  applications: StoreApplication[]
  currency: string
  disabled?: boolean
  onSwitchToBundle: () => void
}

export function BundleSuggestionAlert({
  suggestedBundle,
  applications,
  currency,
  disabled,
  onSwitchToBundle,
}: BundleSuggestionAlertProps) {
  const { t, i18n } = useTranslation()
  const extraApplicationNames = applications
    .filter(({ id }) => suggestedBundle.extraApplicationIds.includes(id))
    .map(({ name }) => name)

  return (
    <Alert>
      <SparklesIcon />
      <AlertTitle>
        {match(suggestedBundle.savingsMinor)
          .with(P.number.positive(), (savingsMinor) =>
            t("pages.store.suggestion.title_savings", {
              bundle: suggestedBundle.name,
              savings: formatMoney(savingsMinor, currency, i18n.language),
            })
          )
          .otherwise(() =>
            t("pages.store.suggestion.title_same_price", {
              bundle: suggestedBundle.name,
            })
          )}
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          {match(extraApplicationNames)
            .with([], () => t("pages.store.suggestion.description"))
            .otherwise((names) =>
              t("pages.store.suggestion.description_with_extras", {
                extras: names.join(", "),
              })
            )}
        </p>
        <Button size="sm" disabled={disabled} onClick={onSwitchToBundle}>
          {t("pages.store.suggestion.switch", { bundle: suggestedBundle.name })}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

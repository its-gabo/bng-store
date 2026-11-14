import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { KeyRoundIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { P, match } from "ts-pattern"

import { useMyLicenseKeyQuery } from "@/api/queries/store/useMyLicenseKeyQuery"

export function LicenseKeyCard() {
  const { t, i18n } = useTranslation()
  const { data: licenseKey, isPending } = useMyLicenseKeyQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRoundIcon className="size-4" />
          {t("pages.account.license_key.title")}
        </CardTitle>
        <CardDescription>
          {t("pages.account.license_key.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {match({ licenseKey, isPending })
          .with({ isPending: true }, () => null)
          .with({ licenseKey: P.nonNullable }, ({ licenseKey: userKey }) => (
            <div className="space-y-1">
              <code className="block rounded-lg bg-muted px-3 py-2 font-mono text-sm">
                {t("pages.account.license_key.masked", {
                  hint: userKey.keyHint,
                })}
              </code>
              <p className="text-xs text-muted-foreground">
                {t("pages.account.license_key.issued_at", {
                  date: new Date(userKey.issuedAt).toLocaleDateString(
                    i18n.language
                  ),
                })}
              </p>
            </div>
          ))
          .otherwise(() => (
            <p className="text-sm text-muted-foreground">
              {t("pages.account.license_key.none")}
            </p>
          ))}
      </CardContent>
    </Card>
  )
}

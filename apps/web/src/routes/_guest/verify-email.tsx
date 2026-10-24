import { Link, createFileRoute } from "@tanstack/react-router"
import { MailCheckIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AuthenticationLayout } from "@/layouts/authentication-layout"
import { createPageMeta } from "@/lib/page-meta"
import { getSafeRedirectTo, getSearchToken } from "@/modules/auth/auth.utils"
import { EmailVerificationStatus } from "@/modules/auth/components/email-verification-status"

export const Route = createFileRoute("/_guest/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: getSearchToken(search.token),
    redirectTo: getSafeRedirectTo(search.redirectTo),
  }),
  head: () => ({
    meta: createPageMeta({
      title: "Confirm your inbox",
      description:
        "We are processing your email verification. This should only take a moment.",
    }),
  }),
  component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
  const { t } = useTranslation()
  const { token, redirectTo } = Route.useSearch()

  return (
    <AuthenticationLayout
      icon={<MailCheckIcon className="size-6" />}
      title={t("pages.verify_email.title")}
      description={t("pages.verify_email.description")}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          <Link
            to="/sign-in"
            search={{ redirectTo }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("pages.verify_email.continue_to_sign_in")}
          </Link>
        </p>
      }
    >
      <EmailVerificationStatus token={token} />
    </AuthenticationLayout>
  )
}

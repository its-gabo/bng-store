import { Link, createFileRoute } from "@tanstack/react-router"
import { MailIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AuthenticationLayout } from "@/layouts/authentication-layout"
import { createPageMeta } from "@/lib/page-meta"
import { ForgotPasswordForm } from "@/modules/auth/components/forgot-password-form"

export const Route = createFileRoute("/_guest/forgot-password")({
  head: () => ({
    meta: createPageMeta({
      title: "Reset access",
      description:
        "Request a password reset email and continue recovery from your inbox.",
    }),
  }),
  component: ForgotPasswordRoute,
})

function ForgotPasswordRoute() {
  const { t } = useTranslation()

  return (
    <AuthenticationLayout
      icon={<MailIcon className="size-6" />}
      title={t("pages.forgot_password.title")}
      description={t("pages.forgot_password.description")}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          <Link
            to="/sign-in"
            search={{ redirectTo: undefined }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("pages.forgot_password.back_to_sign_in")}
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthenticationLayout>
  )
}

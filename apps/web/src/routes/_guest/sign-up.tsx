import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { UserPlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AuthenticationLayout } from "@/layouts/authentication-layout"
import { createPageMeta } from "@/lib/page-meta"
import { getSafeRedirectTo } from "@/modules/auth/auth.utils"
import { SignUpForm } from "@/modules/auth/components/sign-up-form"

export const Route = createFileRoute("/_guest/sign-up")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirectTo: getSafeRedirectTo(search.redirectTo),
  }),
  head: () => ({
    meta: createPageMeta({
      title: "Create your account",
      description: "Register a new BNG Store account.",
    }),
  }),
  component: SignUpRoute,
})

function SignUpRoute() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { redirectTo } = Route.useSearch()

  const handleSignUpSuccess = () => {
    void navigate({ to: "/sign-in", search: { redirectTo }, replace: true })
  }

  return (
    <AuthenticationLayout
      icon={<UserPlusIcon className="size-6" />}
      title={t("pages.sign_up.title")}
      description={t("pages.sign_up.description")}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          {t("pages.sign_up.footer.prompt")}{" "}
          <Link
            to="/sign-in"
            search={{ redirectTo }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("pages.sign_up.footer.link")}
          </Link>
        </p>
      }
    >
      <SignUpForm redirectTo={redirectTo} onSuccess={handleSignUpSuccess} />
    </AuthenticationLayout>
  )
}

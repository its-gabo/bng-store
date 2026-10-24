import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { CircleUserRoundIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AuthenticationLayout } from "@/layouts/authentication-layout"
import { createPageMeta } from "@/lib/page-meta"
import { AUTH_REDIRECT_PATH } from "@/modules/auth/auth.constants"
import { getSafeRedirectTo } from "@/modules/auth/auth.utils"
import { SignInForm } from "@/modules/auth/components/sign-in-form"

export const Route = createFileRoute("/_guest/sign-in")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirectTo: getSafeRedirectTo(search.redirectTo),
  }),
  head: () => ({
    meta: createPageMeta({
      title: "Welcome back",
      description: "Sign in to your BNG Store account.",
    }),
  }),
  component: SignInRoute,
})

function SignInRoute() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { redirectTo } = Route.useSearch()

  const handleSignInSuccess = () => {
    void navigate({ href: redirectTo ?? AUTH_REDIRECT_PATH, replace: true })
  }

  return (
    <AuthenticationLayout
      icon={<CircleUserRoundIcon className="size-6" />}
      title={t("pages.sign_in.title")}
      description={t("pages.sign_in.description")}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          {t("pages.sign_in.footer.prompt")}{" "}
          <Link
            to="/sign-up"
            search={{ redirectTo }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("pages.sign_in.footer.link")}
          </Link>
        </p>
      }
    >
      <SignInForm onSuccess={handleSignInSuccess} />
    </AuthenticationLayout>
  )
}

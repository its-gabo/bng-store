import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { useAuthSessionQuery } from "@/api/queries/auth/useAuthSessionQuery"
import { createPageMeta } from "@/lib/page-meta"
import { SignOutButton } from "@/modules/auth/components/sign-out-button"

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: createPageMeta({
      title: "BNG Store",
      description: "BNG Store",
    }),
  }),
  component: HomeRoute,
})

function HomeRoute() {
  const { t } = useTranslation()
  const { data: session } = useAuthSessionQuery()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("pages.home.title", { name: session?.user?.name })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("pages.home.signed_in_as", { email: session?.user?.email })}
          </p>
        </div>
        <div>
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}

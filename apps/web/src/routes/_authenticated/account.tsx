import { createFileRoute } from "@tanstack/react-router"

import { createPageMeta } from "@/lib/page-meta"
import { AccountPage } from "@/modules/store/components/account-page"

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: createPageMeta({
      title: "Account",
      description: "Your license key and subscriptions.",
    }),
  }),
  component: AccountPage,
})

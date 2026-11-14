import { createFileRoute } from "@tanstack/react-router"

import { createPageMeta } from "@/lib/page-meta"
import { StorePage } from "@/modules/store/components/store-page"

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: createPageMeta({
      title: "Store",
      description: "Pick the Craft apps for your license.",
    }),
  }),
  component: StorePage,
})

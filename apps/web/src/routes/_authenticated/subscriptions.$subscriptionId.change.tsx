import { createFileRoute } from "@tanstack/react-router"

import { createPageMeta } from "@/lib/page-meta"
import { ChangePlanPage } from "@/modules/store/components/change-plan-page"

export const Route = createFileRoute(
  "/_authenticated/subscriptions/$subscriptionId/change"
)({
  head: () => ({
    meta: createPageMeta({
      title: "Change plan",
      description: "Change the apps or billing period of your subscription.",
    }),
  }),
  component: ChangePlanRoute,
})

function ChangePlanRoute() {
  const { subscriptionId } = Route.useParams()

  return <ChangePlanPage subscriptionId={subscriptionId} />
}

import { Outlet, createFileRoute } from "@tanstack/react-router"

import { redirectAuthenticated } from "@/modules/auth/auth.guards"

export const Route = createFileRoute("/_guest")({
  ssr: false,
  beforeLoad: ({ context, location }) =>
    redirectAuthenticated({ queryClient: context.queryClient, location }),
  component: Outlet,
})

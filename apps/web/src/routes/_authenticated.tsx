import { Outlet, createFileRoute } from "@tanstack/react-router"

import { requireAuthenticated } from "@/modules/auth/auth.guards"

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ context, location }) =>
    requireAuthenticated({ queryClient: context.queryClient, location }),
  component: Outlet,
})

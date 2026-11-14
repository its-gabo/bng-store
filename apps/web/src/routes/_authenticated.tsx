import { Outlet, createFileRoute } from "@tanstack/react-router"

import { AppLayout } from "@/layouts/app-layout"
import { requireAuthenticated } from "@/modules/auth/auth.guards"

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ context, location }) =>
    requireAuthenticated({ queryClient: context.queryClient, location }),
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

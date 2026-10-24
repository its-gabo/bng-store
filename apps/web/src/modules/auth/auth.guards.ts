import { redirect } from "@tanstack/react-router"

import { AUTH_REDIRECT_PATH } from "./auth.constants"
import { getSafeRedirectTo } from "./auth.utils"

import type { QueryClient } from "@tanstack/react-query"

import { authSessionQueryOptions } from "@/api/queries/auth/useAuthSessionQuery"

type GuardParams = {
  queryClient: QueryClient
  location: { href: string; search: Record<string, unknown> }
}

export async function requireAuthenticated({
  queryClient,
  location,
}: GuardParams) {
  const session = await queryClient.fetchQuery(authSessionQueryOptions)

  if (session.authenticated && session.user) return { user: session.user }

  throw redirect({
    to: "/sign-in",
    search: { redirectTo: getSafeRedirectTo(location.href) },
  })
}

export async function redirectAuthenticated({
  queryClient,
  location,
}: GuardParams) {
  const session = await queryClient.fetchQuery(authSessionQueryOptions)

  if (!session.authenticated) return

  throw redirect({
    href: getSafeRedirectTo(location.search.redirectTo) ?? AUTH_REDIRECT_PATH,
  })
}

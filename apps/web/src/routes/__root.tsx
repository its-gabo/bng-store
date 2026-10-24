import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { Toaster } from "@workspace/ui/components/sonner"

import appCss from "@workspace/ui/globals.css?url"

import "@/i18n/i18n"

import { createPageMeta } from "@/lib/page-meta"
import type { RouterContext } from "@/router.types"

import { AppProviders } from "@/providers/app-providers"

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...createPageMeta({
        title: "BNG Store",
        description: "BNG Store",
        noIndex: false,
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppProviders queryClient={queryClient}>{children}</AppProviders>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}

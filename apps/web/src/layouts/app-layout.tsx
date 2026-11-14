import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import type { ReactNode } from "react"

import { SignOutButton } from "@/modules/auth/components/sign-out-button"

type AppLayoutProps = {
  children: ReactNode
}

const NAVIGATION_LINK_CLASS_NAME =
  "rounded-4xl px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold tracking-tight">
              BNG Store
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                className={NAVIGATION_LINK_CLASS_NAME}
              >
                {t("navigation.store")}
              </Link>
              <Link to="/account" className={NAVIGATION_LINK_CLASS_NAME}>
                {t("navigation.account")}
              </Link>
            </nav>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

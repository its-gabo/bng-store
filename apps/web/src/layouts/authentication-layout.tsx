import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"

import type { ReactNode } from "react"

type AuthenticationLayoutProps = {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthenticationLayout({
  icon,
  title,
  description,
  children,
  footer,
}: AuthenticationLayoutProps) {
  return (
    <div className="min-h-svh bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-md items-center justify-center">
        <Card className="w-full gap-0 py-0">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="space-y-6">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-muted text-foreground">
                {icon}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-6">{children}</div>
          </CardContent>

          {footer && (
            <CardFooter className="grid place-items-center border-t py-4">
              {footer}
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  )
}

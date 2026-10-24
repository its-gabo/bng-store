import { useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { LoaderCircleIcon, LogOutIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { useAuthSignOutMutation } from "@/api/mutations/auth/useAuthSignOutMutation"

export function SignOutButton() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutate: signOut, isPending: isSignOutPending } =
    useAuthSignOutMutation({
      onSuccess: () => {
        void navigate({
          to: "/sign-in",
          search: { redirectTo: undefined },
          replace: true,
        })
      },
    })

  return (
    <Button
      variant="outline"
      disabled={isSignOutPending}
      onClick={() => signOut()}
    >
      {t("pages.home.sign_out")}
      {match(isSignOutPending)
        .with(true, () => <LoaderCircleIcon className="size-4 animate-spin" />)
        .with(false, () => <LogOutIcon className="size-4" />)
        .exhaustive()}
    </Button>
  )
}

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { CircleCheckIcon, CircleXIcon, LoaderCircleIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { match } from "ts-pattern"

import { useAuthVerifyEmailQuery } from "@/api/queries/auth/useAuthVerifyEmailQuery"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"
import { EMAIL_VERIFICATION_STATE } from "@/modules/auth/auth.constants"

type EmailVerificationStatusProps = {
  token?: string
}

export function EmailVerificationStatus({
  token,
}: EmailVerificationStatusProps) {
  const { t } = useTranslation()

  const hasShownSuccessToast = useRef(false)
  const hasShownErrorToast = useRef(false)

  const {
    data: verifyEmailResponse,
    error: verifyEmailError,
    isPending: isVerifyEmailPending,
    isSuccess: isVerifyEmailSuccess,
  } = useAuthVerifyEmailQuery(token ?? null)

  useEffect(() => {
    if (!isVerifyEmailSuccess || hasShownSuccessToast.current) return

    toast.success(
      resolveApiToastMessage(
        verifyEmailResponse,
        t,
        API_TOAST_MESSAGE_TYPE.SUCCESS
      )
    )
    hasShownSuccessToast.current = true
  }, [isVerifyEmailSuccess, t, verifyEmailResponse])

  useEffect(() => {
    if (!verifyEmailError || hasShownErrorToast.current) return

    toast.error(
      resolveApiToastMessage(verifyEmailError, t, API_TOAST_MESSAGE_TYPE.ERROR)
    )
    hasShownErrorToast.current = true
  }, [t, verifyEmailError])

  const result = match({
    hasToken: Boolean(token),
    isPending: isVerifyEmailPending,
    isSuccess: isVerifyEmailSuccess,
  })
    .with({ hasToken: false }, () => ({
      state: EMAIL_VERIFICATION_STATE.ERROR,
      message: t("pages.verify_email.result.missing_token"),
    }))
    .with({ isPending: true }, () => ({
      state: EMAIL_VERIFICATION_STATE.PENDING,
      message: t("pages.verify_email.result.pending"),
    }))
    .with({ isSuccess: true }, () => ({
      state: EMAIL_VERIFICATION_STATE.SUCCESS,
      message: t("pages.verify_email.result.success"),
    }))
    .otherwise(() => ({
      state: EMAIL_VERIFICATION_STATE.ERROR,
      message: t("pages.verify_email.result.error"),
    }))

  return match(result.state)
    .with(EMAIL_VERIFICATION_STATE.PENDING, () => (
      <Alert>
        <LoaderCircleIcon className="animate-spin" />
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    ))
    .with(EMAIL_VERIFICATION_STATE.SUCCESS, () => (
      <Alert>
        <CircleCheckIcon />
        <AlertTitle>{t("pages.verify_email.alert.success_title")}</AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    ))
    .otherwise(() => (
      <Alert variant="destructive">
        <CircleXIcon />
        <AlertTitle>{t("pages.verify_email.alert.error_title")}</AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    ))
}

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { FormFieldRenderer } from "@workspace/ui/components/form-field-renderer"
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { resetPasswordFormSchema } from "../auth.schemas"

import type {
  ResetPasswordFormValues,
  ResetPasswordValues,
} from "../auth.types"

import { useAuthResetPasswordMutation } from "@/api/mutations/auth/useAuthResetPasswordMutation"
import { getFormFields } from "@/lib/get-form-fields"

type ResetPasswordFormProps = {
  token?: string
  onSuccess: () => void
}

export function ResetPasswordForm({
  token,
  onSuccess,
}: ResetPasswordFormProps) {
  const { t } = useTranslation()
  const schema = resetPasswordFormSchema(t)

  const form = useForm<ResetPasswordFormValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { mutate: resetPassword, isPending: isResetPasswordPending } =
    useAuthResetPasswordMutation({
      onSuccess,
    })

  const handleOnSubmit = (values: ResetPasswordFormValues) => {
    if (!token) throw new Error("Missing reset password token")

    const payload: ResetPasswordValues = {
      token,
      ...values,
    }

    resetPassword(payload)
  }
  const formFields = getFormFields(schema)

  return !token ? (
    <Alert variant="destructive">
      <AlertDescription>
        {t("pages.reset_password.missing_token")}
      </AlertDescription>
    </Alert>
  ) : (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        void form.handleSubmit(handleOnSubmit)(event)
      }}
    >
      <FormFieldRenderer
        control={form.control}
        errors={form.formState.errors}
        fields={formFields}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={isResetPasswordPending}
      >
        {t("pages.reset_password.submit")}
        {match(isResetPasswordPending)
          .with(true, () => (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ))
          .with(false, () => <ArrowRightIcon className="size-4" />)
          .exhaustive()}
      </Button>
    </form>
  )
}

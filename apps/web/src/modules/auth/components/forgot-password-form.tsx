import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Button } from "@workspace/ui/components/button"
import { FormFieldRenderer } from "@workspace/ui/components/form-field-renderer"
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { forgotPasswordSchema } from "../auth.schemas"

import type { ForgotPasswordValues } from "../auth.types"

import { useAuthForgotPasswordMutation } from "@/api/mutations/auth/useAuthForgotPasswordMutation"
import { getFormFields } from "@/lib/get-form-fields"

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const schema = forgotPasswordSchema(t)
  const form = useForm<ForgotPasswordValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  const {
    mutate: requestPasswordReset,
    isPending: isRequestPasswordResetPending,
  } = useAuthForgotPasswordMutation()

  const handleOnSubmit = (values: ForgotPasswordValues) =>
    requestPasswordReset(values)

  const formFields = getFormFields(schema)

  return (
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
        disabled={isRequestPasswordResetPending}
      >
        {t("pages.forgot_password.submit")}
        {match(isRequestPasswordResetPending)
          .with(true, () => (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ))
          .with(false, () => <ArrowRightIcon className="size-4" />)
          .exhaustive()}
      </Button>
    </form>
  )
}

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Button } from "@workspace/ui/components/button"
import { FormFieldRenderer } from "@workspace/ui/components/form-field-renderer"
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { match } from "ts-pattern"

import { signUpFormSchema } from "../auth.schemas"

import type { SignUpFormValues } from "../auth.types"

import { useAuthSignUpMutation } from "@/api/mutations/auth/useAuthSignUpMutation"
import { getFormFields } from "@/lib/get-form-fields"

type SignUpFormProps = {
  onSuccess: () => void
  redirectTo?: string
}

export function SignUpForm({ onSuccess, redirectTo }: SignUpFormProps) {
  const { t } = useTranslation()
  const schema = signUpFormSchema(t)

  const form = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { mutate: signUp, isPending: isSignUpPending } = useAuthSignUpMutation({
    onSuccess,
  })

  const handleOnSubmit = ({ ...values }: SignUpFormValues) => {
    signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      redirectTo,
    })
  }
  const formFields = getFormFields(schema)

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        void form.handleSubmit(handleOnSubmit)(event)
      }}
      autoComplete="off"
    >
      <FormFieldRenderer
        control={form.control}
        errors={form.formState.errors}
        fields={formFields}
      />
      <Button type="submit" className="w-full" disabled={isSignUpPending}>
        {t("pages.sign_up.submit")}
        {match(isSignUpPending)
          .with(true, () => (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ))
          .with(false, () => <ArrowRightIcon className="size-4" />)
          .exhaustive()}
      </Button>
    </form>
  )
}

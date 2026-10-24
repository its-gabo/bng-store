import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Button } from "@workspace/ui/components/button"
import { FormFieldRenderer } from "@workspace/ui/components/form-field-renderer"
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link } from "@tanstack/react-router"
import { match } from "ts-pattern"

import { signInSchema } from "../auth.schemas"

import type { SignInValues } from "../auth.types"

import { useAuthSignInMutation } from "@/api/mutations/auth/useAuthSignInMutation"
import { getFormFields } from "@/lib/get-form-fields"

type SignInFormProps = {
  onSuccess: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { t } = useTranslation()
  const schema = signInSchema(t)

  const form = useForm<SignInValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: signIn, isPending: isSignInPending } = useAuthSignInMutation({
    onSuccess,
  })

  const handleOnSubmit = (values: SignInValues) => {
    signIn(values)
  }

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
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          {t("pages.sign_in.forgot_password")}
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isSignInPending}>
        {t("pages.sign_in.submit")}
        {match(isSignInPending)
          .with(true, () => (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ))
          .with(false, () => <ArrowRightIcon className="size-4" />)
          .exhaustive()}
      </Button>
    </form>
  )
}

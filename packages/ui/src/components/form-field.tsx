import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form"

import { Label } from "@workspace/ui/components/label"
import { PasswordField } from "@workspace/ui/components/password-field"
import { TextField } from "@workspace/ui/components/text-field"

import type { FormFieldType } from "@workspace/ui/lib/form-field.types"

type FormFieldProps<T extends FieldValues> = {
  field: FormFieldType
  error?: FieldError
  control: Control<T>
}

function FormField<T extends FieldValues>({
  field: formField,
  error,
  control,
}: FormFieldProps<T>) {
  const isInvalid = Boolean(error)

  return (
    <Controller
      name={formField.name as Path<T>}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <Label htmlFor={formField.name}>{formField.label}</Label>
          {formField.type === "password" ? (
            <PasswordField
              name={formField.name}
              autoComplete={formField.autoComplete}
              placeholder={formField.placeholder}
              invalid={isInvalid}
              field={field}
            />
          ) : (
            <TextField
              name={formField.name}
              type={formField.type === "email" ? "email" : "text"}
              autoComplete={formField.autoComplete}
              placeholder={formField.placeholder}
              invalid={isInvalid}
              field={field}
            />
          )}
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  )
}

export { FormField }

import { Input } from "@workspace/ui/components/input"

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

type TextFieldProps<T extends FieldValues> = {
  name: string
  type?: "text" | "email"
  autoComplete?: string
  placeholder?: string
  invalid?: boolean
  field: ControllerRenderProps<T, Path<T>>
}

function TextField<T extends FieldValues>({
  name,
  type = "text",
  autoComplete,
  placeholder,
  invalid,
  field,
}: TextFieldProps<T>) {
  return (
    <Input
      id={name}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      {...field}
    />
  )
}

export { TextField }

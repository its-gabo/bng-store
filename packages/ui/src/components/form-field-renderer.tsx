import { cn } from "cn"

import { FormField } from "@workspace/ui/components/form-field"

import type {
  Control,
  FieldError,
  FieldErrors,
  FieldValues,
} from "react-hook-form"
import type { FormFieldType } from "@workspace/ui/lib/form-field.types"

type FormFieldRendererProps<T extends FieldValues> = {
  className?: string
  fields: FormFieldType[]
  errors?: FieldErrors<T>
  control: Control<T>
}

function FormFieldRenderer<T extends FieldValues>({
  className,
  fields,
  errors,
  control,
}: FormFieldRendererProps<T>) {
  return (
    <div className={cn("space-y-4", className)}>
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          error={errors ? (errors[field.name] as FieldError) : undefined}
          control={control}
        />
      ))}
    </div>
  )
}

export { FormFieldRenderer }

import type { FormFieldType } from "@workspace/ui/lib/form-field.types"
import type { ZodObject, ZodRawShape, ZodType } from "zod"

export const getFormFields = <T extends ZodRawShape>(
  schema: ZodObject<T>
): FormFieldType[] => {
  return Object.entries(schema.shape).map(([name, value]) => {
    const meta = (value as ZodType<unknown>).meta() as
      Omit<FormFieldType, "name"> | undefined

    return {
      name,
      label: meta?.label,
      placeholder: meta?.placeholder,
      type: meta?.type,
      autoComplete: meta?.autoComplete,
    }
  })
}

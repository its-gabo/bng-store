export interface FormFieldType {
  name: string
  label?: string
  placeholder?: string
  type?: "text" | "email" | "password"
  autoComplete?: string
}

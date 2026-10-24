import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

type PasswordFieldProps<T extends FieldValues> = {
  name: string
  autoComplete?: string
  placeholder?: string
  invalid?: boolean
  field: ControllerRenderProps<T, Path<T>>
}

function PasswordField<T extends FieldValues>({
  name,
  autoComplete,
  placeholder,
  invalid,
  field,
}: PasswordFieldProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        id={name}
        className="pe-9"
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        type={isPasswordVisible ? "text" : "password"}
        {...field}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute inset-y-0 end-0 h-full w-9 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
        type="button"
        onClick={() => setIsPasswordVisible((prev) => !prev)}
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        aria-pressed={isPasswordVisible}
        aria-controls={name}
      >
        {isPasswordVisible ? (
          <EyeOffIcon className="size-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="size-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}

export { PasswordField }

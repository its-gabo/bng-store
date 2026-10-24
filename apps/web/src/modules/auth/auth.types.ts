import type {
  authSessionSchema,
  authUserSchema,
  forgotPasswordSchema,
  resetPasswordFormSchema,
  resetPasswordSchema,
  signUpFormSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from "./auth.schemas"
import type { z } from "zod"

export type AuthUser = z.infer<typeof authUserSchema>
export type AuthSession = z.infer<typeof authSessionSchema>
export type SignInValues = z.infer<ReturnType<typeof signInSchema>>
export type SignUpValues = z.infer<ReturnType<typeof signUpSchema>>
export type SignUpFormValues = z.infer<ReturnType<typeof signUpFormSchema>>
export type ForgotPasswordValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>
export type ResetPasswordValues = z.infer<
  ReturnType<typeof resetPasswordSchema>
>
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof resetPasswordFormSchema>
>
export type VerifyEmailValues = z.infer<ReturnType<typeof verifyEmailSchema>>

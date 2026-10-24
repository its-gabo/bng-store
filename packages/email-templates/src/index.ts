import { emailTemplateFactory } from "./email-factory"
import ResetPasswordEmailTemplate from "./templates/ResetPasswordEmail"
import WelcomeVerifyEmailTemplate from "./templates/WelcomeVerifyEmail"

export type { ResetPasswordEmailProps } from "./templates/ResetPasswordEmail"
export type { WelcomeVerifyEmailProps } from "./templates/WelcomeVerifyEmail"

export const WelcomeVerifyEmail = emailTemplateFactory(
  WelcomeVerifyEmailTemplate
)
export const ResetPasswordEmail = emailTemplateFactory(
  ResetPasswordEmailTemplate
)

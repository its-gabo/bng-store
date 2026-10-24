import { z } from "zod"

import type i18next from "i18next"

function createEmailSchema(t: typeof i18next.t) {
  return z
    .email(t("validation.email.invalid"))
    .trim()
    .min(3, t("validation.email.invalid"))
}

function createPasswordSchema(t: typeof i18next.t) {
  return z.string().min(8, t("validation.password.min_length"))
}

function createNameSchema(t: typeof i18next.t) {
  return z.string().trim().min(1, t("validation.name.required"))
}

export const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  emailVerified: z.boolean(),
})

export const authSessionSchema = z.object({
  authenticated: z.boolean(),
  user: authUserSchema.optional(),
})

export const signInSchema = (t: typeof i18next.t) =>
  z.object({
    email: createEmailSchema(t).meta({
      label: t("pages.sign_in.email_label"),
      placeholder: t("pages.sign_in.email_placeholder"),
      type: "email",
      autoComplete: "email",
    }),
    password: createPasswordSchema(t).meta({
      label: t("pages.sign_in.password_label"),
      placeholder: t("pages.sign_in.password_placeholder"),
      type: "password",
      autoComplete: "current-password",
    }),
  })

export const signUpSchema = (t: typeof i18next.t) =>
  z.object({
    name: createNameSchema(t),
    email: createEmailSchema(t),
    password: createPasswordSchema(t),
  })

export const signUpFormSchema = (t: typeof i18next.t) =>
  z
    .object({
      name: createNameSchema(t).meta({
        label: t("pages.sign_up.name_label"),
        placeholder: t("pages.sign_up.name_placeholder"),
        type: "text",
        autoComplete: "name",
      }),
      email: createEmailSchema(t).meta({
        label: t("pages.sign_up.email_label"),
        placeholder: t("pages.sign_up.email_placeholder"),
        type: "email",
        autoComplete: "email",
      }),
      password: createPasswordSchema(t).meta({
        label: t("pages.sign_up.password_label"),
        placeholder: t("pages.sign_up.password_placeholder"),
        type: "password",
        autoComplete: "new-password",
      }),
      confirmPassword: createPasswordSchema(t).meta({
        label: t("pages.sign_up.confirm_password_label"),
        placeholder: t("pages.sign_up.confirm_password_placeholder"),
        type: "password",
        autoComplete: "new-password",
      }),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: t("validation.password.confirm_mismatch"),
      path: ["confirmPassword"],
    })

export const forgotPasswordSchema = (t: typeof i18next.t) =>
  z.object({
    email: createEmailSchema(t).meta({
      label: t("pages.forgot_password.email_label"),
      placeholder: t("pages.forgot_password.email_placeholder"),
      type: "email",
      autoComplete: "email",
    }),
  })

export const resetPasswordFormSchema = (t: typeof i18next.t) =>
  z
    .object({
      password: createPasswordSchema(t).meta({
        label: t("pages.reset_password.new_password_label"),
        placeholder: t("pages.reset_password.new_password_placeholder"),
        type: "password",
        autoComplete: "new-password",
      }),
      confirmPassword: createPasswordSchema(t).meta({
        label: t("pages.reset_password.confirm_password_label"),
        placeholder: t("pages.reset_password.confirm_password_placeholder"),
        type: "password",
        autoComplete: "new-password",
      }),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: t("validation.password.confirm_mismatch"),
      path: ["confirmPassword"],
    })

export const resetPasswordSchema = (t: typeof i18next.t) =>
  z
    .object({
      token: z.string().min(1, t("validation.reset_token.missing")),
      password: createPasswordSchema(t),
      confirmPassword: createPasswordSchema(t),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: t("validation.password.confirm_mismatch"),
      path: ["confirmPassword"],
    })

export const verifyEmailSchema = (t: typeof i18next.t) =>
  z.object({
    token: z.string().min(1, t("validation.verification_token.missing")),
  })

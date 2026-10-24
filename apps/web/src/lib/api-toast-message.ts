import axios from "axios"

import type i18next from "i18next"

export const API_TOAST_MESSAGE_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
} as const

export type ApiToastMessageType =
  (typeof API_TOAST_MESSAGE_TYPE)[keyof typeof API_TOAST_MESSAGE_TYPE]

type ApiResponseWithCode = {
  code?: unknown
}

function normalizeCode(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null
}

export function getApiCode(input: unknown) {
  if (axios.isAxiosError<ApiResponseWithCode>(input)) {
    return normalizeCode(input.response?.data.code)
  }

  if (!input || typeof input !== "object") return null

  return normalizeCode((input as ApiResponseWithCode).code)
}

export function resolveApiToastMessage(
  input: unknown,
  t: typeof i18next.t,
  type: ApiToastMessageType
) {
  const fallbackMessage = t("api.error.fallback")

  const code = getApiCode(input)

  if (!code) return fallbackMessage

  const key =
    type === API_TOAST_MESSAGE_TYPE.SUCCESS
      ? `api.success.${code}`
      : `api.error.${code}`

  return t(key, { defaultValue: fallbackMessage })
}

import { useQuery } from "@tanstack/react-query"

import type { VerifyEmailValues } from "@/modules/auth/auth.types"

import { apiClient } from "@/api/api-client"
import { AUTH_VERIFY_EMAIL_QUERY_KEY } from "@/modules/auth/auth.query-keys"

const VERIFY_EMAIL_MIN_PENDING_MS = 1500

export function useAuthVerifyEmailQuery(
  token: VerifyEmailValues["token"] | null
) {
  return useQuery({
    queryKey: [...AUTH_VERIFY_EMAIL_QUERY_KEY, token],
    enabled: Boolean(token),
    retry: false,
    queryFn: async () => {
      if (!token) return null

      await new Promise((resolve) =>
        setTimeout(resolve, VERIFY_EMAIL_MIN_PENDING_MS)
      )

      const { data } = await apiClient.api.authControllerVerifyEmail({
        token,
      })

      return data
    },
  })
}

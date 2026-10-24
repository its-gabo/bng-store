import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import type {
  AuthSession,
  AuthUser,
  SignInValues,
} from "@/modules/auth/auth.types"

import { apiClient } from "@/api/api-client"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"
import { AUTH_SESSION_QUERY_KEY } from "@/modules/auth/auth.query-keys"

type UseAuthSignInMutationOptions = {
  onSuccess?: (user: AuthUser) => void
}

export function useAuthSignInMutation(
  options: UseAuthSignInMutationOptions = {}
) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: SignInValues) => {
      const { data } = await apiClient.api.authControllerSignInEmail(values)

      return data
    },
    onSuccess: (response) => {
      const { user } = response.data

      queryClient.setQueryData<AuthSession>(AUTH_SESSION_QUERY_KEY, {
        authenticated: true,
        user,
      })

      toast.success(
        resolveApiToastMessage(response, t, API_TOAST_MESSAGE_TYPE.SUCCESS)
      )

      options.onSuccess?.(user)
    },
    onError: (error) => {
      toast.error(
        resolveApiToastMessage(error, t, API_TOAST_MESSAGE_TYPE.ERROR)
      )
    },
  })
}

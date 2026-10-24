import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import type { AuthSession } from "@/modules/auth/auth.types"

import { apiClient } from "@/api/api-client"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"
import { AUTH_SESSION_QUERY_KEY } from "@/modules/auth/auth.query-keys"

type UseAuthSignOutMutationOptions = {
  onSuccess?: () => void
}

export function useAuthSignOutMutation(
  options: UseAuthSignOutMutationOptions = {}
) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.api.authControllerSignOut()

      return data
    },
    onSuccess: (response) => {
      queryClient.setQueryData<AuthSession>(AUTH_SESSION_QUERY_KEY, {
        authenticated: false,
      })

      toast.success(
        resolveApiToastMessage(response, t, API_TOAST_MESSAGE_TYPE.SUCCESS)
      )
      options.onSuccess?.()
    },
    onError: (error) => {
      toast.error(
        resolveApiToastMessage(error, t, API_TOAST_MESSAGE_TYPE.ERROR)
      )
    },
  })
}

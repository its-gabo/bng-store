import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import type { ForgotPasswordValues } from "@/modules/auth/auth.types"

import { apiClient } from "@/api/api-client"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"

type UseAuthForgotPasswordMutationOptions = {
  onSuccess?: () => void
}

export function useAuthForgotPasswordMutation(
  options: UseAuthForgotPasswordMutationOptions = {}
) {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (values: ForgotPasswordValues) => {
      const { data } = await apiClient.api.authControllerForgotPassword(values)

      return data
    },
    onSuccess: (response) => {
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

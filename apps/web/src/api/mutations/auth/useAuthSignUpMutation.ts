import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import type { SignUpEmailBody } from "@/api/generated-api"

import { apiClient } from "@/api/api-client"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"

type UseAuthSignUpMutationOptions = {
  onSuccess?: () => void
}

export function useAuthSignUpMutation(
  options: UseAuthSignUpMutationOptions = {}
) {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (values: SignUpEmailBody) => {
      const { data } = await apiClient.api.authControllerSignUpEmail(values)

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

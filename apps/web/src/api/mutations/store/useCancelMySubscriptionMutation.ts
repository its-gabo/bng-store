import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { apiClient } from "@/api/api-client"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"
import { MY_SUBSCRIPTIONS_QUERY_KEY } from "@/modules/store/store.query-keys"

export function useCancelMySubscriptionMutation() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data } =
        await apiClient.api.mySubscriptionsControllerCancelMySubscription(
          subscriptionId
        )

      return data
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: MY_SUBSCRIPTIONS_QUERY_KEY,
      })

      toast.success(
        resolveApiToastMessage(response, t, API_TOAST_MESSAGE_TYPE.SUCCESS)
      )
    },
    onError: (error) => {
      toast.error(
        resolveApiToastMessage(error, t, API_TOAST_MESSAGE_TYPE.ERROR)
      )
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import type { ConfirmedOrder } from "@/modules/store/store.types"

import { apiClient } from "@/api/api-client"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"
import {
  MY_LICENSE_KEY_QUERY_KEY,
  MY_SUBSCRIPTIONS_QUERY_KEY,
} from "@/modules/store/store.query-keys"

type UseStoreConfirmMockPaymentMutationOptions = {
  onSuccess?: (confirmedOrder: ConfirmedOrder) => void
}

export function useStoreConfirmMockPaymentMutation(
  options: UseStoreConfirmMockPaymentMutationOptions = {}
) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (paymentReference: string) => {
      const { data } =
        await apiClient.api.storeCheckoutControllerConfirmMockPayment(
          paymentReference
        )

      return data
    },
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTIONS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: MY_LICENSE_KEY_QUERY_KEY }),
      ])

      toast.success(
        resolveApiToastMessage(response, t, API_TOAST_MESSAGE_TYPE.SUCCESS)
      )
      options.onSuccess?.(response.data)
    },
    onError: (error) => {
      toast.error(
        resolveApiToastMessage(error, t, API_TOAST_MESSAGE_TYPE.ERROR)
      )
    },
  })
}

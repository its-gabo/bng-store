import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import type { StoreSelectionBody } from "@/api/generated-api"
import type { PendingOrder } from "@/modules/store/store.types"

import { apiClient } from "@/api/api-client"
import {
  API_TOAST_MESSAGE_TYPE,
  resolveApiToastMessage,
} from "@/lib/api-toast-message"

type RequestSubscriptionAdjustmentValues = {
  subscriptionId: string
  selection: StoreSelectionBody
}

type UseRequestSubscriptionAdjustmentMutationOptions = {
  onSuccess?: (pendingOrder: PendingOrder) => void
}

export function useRequestSubscriptionAdjustmentMutation(
  options: UseRequestSubscriptionAdjustmentMutationOptions = {}
) {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      selection,
    }: RequestSubscriptionAdjustmentValues) => {
      const { data } =
        await apiClient.api.mySubscriptionsControllerRequestMySubscriptionAdjustment(
          subscriptionId,
          selection
        )

      return data
    },
    onSuccess: (response) => {
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

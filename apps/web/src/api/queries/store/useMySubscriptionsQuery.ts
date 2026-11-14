import { queryOptions, useQuery } from "@tanstack/react-query"

import { apiClient } from "@/api/api-client"
import { MY_SUBSCRIPTIONS_QUERY_KEY } from "@/modules/store/store.query-keys"

export const mySubscriptionsQueryOptions = queryOptions({
  queryKey: MY_SUBSCRIPTIONS_QUERY_KEY,
  queryFn: async () => {
    const { data } =
      await apiClient.api.mySubscriptionsControllerListMySubscriptions()

    return data.data
  },
})

export function useMySubscriptionsQuery() {
  return useQuery(mySubscriptionsQueryOptions)
}

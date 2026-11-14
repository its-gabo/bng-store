import { queryOptions, useQuery } from "@tanstack/react-query"

import { apiClient } from "@/api/api-client"
import { MY_LICENSE_KEY_QUERY_KEY } from "@/modules/store/store.query-keys"

export const myLicenseKeyQueryOptions = queryOptions({
  queryKey: MY_LICENSE_KEY_QUERY_KEY,
  queryFn: async () => {
    const { data } = await apiClient.api.myLicenseKeyControllerGetMyLicenseKey()

    return data.data
  },
})

export function useMyLicenseKeyQuery() {
  return useQuery(myLicenseKeyQueryOptions)
}

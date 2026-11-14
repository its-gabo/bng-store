import { queryOptions, useQuery } from "@tanstack/react-query"

import { apiClient } from "@/api/api-client"
import { STORE_CATALOG_STALE_TIME_MS } from "@/modules/store/store.constants"
import { STORE_CATALOG_QUERY_KEY } from "@/modules/store/store.query-keys"

export const storeCatalogQueryOptions = queryOptions({
  queryKey: STORE_CATALOG_QUERY_KEY,
  staleTime: STORE_CATALOG_STALE_TIME_MS,
  queryFn: async () => {
    const { data } = await apiClient.api.storeCatalogControllerGetCatalog()

    return data.data
  },
})

export function useStoreCatalogQuery() {
  return useQuery(storeCatalogQueryOptions)
}

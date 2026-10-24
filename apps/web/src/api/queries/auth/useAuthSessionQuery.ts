import { queryOptions, useQuery } from "@tanstack/react-query"

import { apiClient } from "@/api/api-client"
import { AUTH_SESSION_STALE_TIME_MS } from "@/modules/auth/auth.constants"
import { AUTH_SESSION_QUERY_KEY } from "@/modules/auth/auth.query-keys"

export const authSessionQueryOptions = queryOptions({
  queryKey: AUTH_SESSION_QUERY_KEY,
  staleTime: AUTH_SESSION_STALE_TIME_MS,
  retry: false,
  queryFn: async () => {
    const { data } = await apiClient.api.authControllerGetSession()

    return data.data
  },
})

export function useAuthSessionQuery() {
  return useQuery(authSessionQueryOptions)
}

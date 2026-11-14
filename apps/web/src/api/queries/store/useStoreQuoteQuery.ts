import { keepPreviousData, useQuery } from "@tanstack/react-query"

import type { QuoteCustomSelectionBody } from "@/api/generated-api"

import { apiClient } from "@/api/api-client"
import { STORE_QUOTE_QUERY_KEY } from "@/modules/store/store.query-keys"

/** Prices a custom selection and asks for a cheaper bundle. Disabled while `selection` is null. */
export function useStoreQuoteQuery(selection: QuoteCustomSelectionBody | null) {
  return useQuery({
    queryKey: [
      ...STORE_QUOTE_QUERY_KEY,
      selection?.billingPeriod,
      [...(selection?.applicationIds ?? [])].sort(),
    ],
    enabled: Boolean(selection),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (!selection) return null

      const { data } =
        await apiClient.api.storeCatalogControllerQuoteCustomSelection(
          selection
        )

      return data.data
    },
  })
}

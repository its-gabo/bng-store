import { useState } from "react"
import { match } from "ts-pattern"

import { BILLING_PERIODS } from "../store.constants"

import type {
  BillingPeriod,
  StoreBundle,
  StoreCart,
  SuggestedBundle,
} from "../store.types"

const EMPTY_CART: StoreCart = {
  billingPeriod: BILLING_PERIODS.MONTHLY,
  bundleId: null,
  applicationIds: [],
}

export function useStoreCart(initialCart: StoreCart = EMPTY_CART) {
  const [cart, setCart] = useState<StoreCart>(initialCart)

  const toggleApplication = (applicationId: string) => {
    setCart((current) => ({
      ...current,
      applicationIds: match(current.applicationIds.includes(applicationId))
        .with(true, () =>
          current.applicationIds.filter((id) => id !== applicationId)
        )
        .with(false, () => [...current.applicationIds, applicationId])
        .exhaustive(),
    }))
  }

  /** Choosing a bundle drops the picked applications it already includes. */
  const toggleBundle = (bundle: StoreBundle) => {
    setCart((current) =>
      match(current.bundleId === bundle.id)
        .with(true, () => ({ ...current, bundleId: null }))
        .with(false, () => ({
          ...current,
          bundleId: bundle.id,
          applicationIds: current.applicationIds.filter(
            (id) => !bundle.applicationIds.includes(id)
          ),
        }))
        .exhaustive()
    )
  }

  const changeBillingPeriod = (billingPeriod: BillingPeriod) => {
    setCart((current) => ({ ...current, billingPeriod }))
  }

  const switchToSuggestedBundle = (suggestedBundle: SuggestedBundle) => {
    setCart((current) => ({
      ...current,
      bundleId: suggestedBundle.bundleId,
      applicationIds: suggestedBundle.extraApplicationIds,
    }))
  }

  const clearCart = () => {
    setCart((current) => ({
      ...EMPTY_CART,
      billingPeriod: current.billingPeriod,
    }))
  }

  return {
    cart,
    toggleApplication,
    toggleBundle,
    changeBillingPeriod,
    switchToSuggestedBundle,
    clearCart,
  }
}

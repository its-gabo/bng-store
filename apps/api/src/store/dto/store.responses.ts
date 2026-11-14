import type { ApiResultCatalog } from '../../common/http/response/response.types';

export const STORE_SUCCESS_CODES = {
  CATALOG: 'store.catalog.success',
  QUOTE: 'store.quote.success',
  CHECKOUT: 'store.checkout.success',
  PAYMENT: 'store.payment.success',
  SUBSCRIPTIONS: 'store.subscriptions.success',
  SUBSCRIPTION_CANCEL: 'store.subscription.cancel.success',
  SUBSCRIPTION_ADJUST: 'store.subscription.adjust.success',
  LICENSE_KEY: 'store.license_key.success',
} as const;

export const STORE_SUCCESS_RESULTS = {
  CATALOG: { code: STORE_SUCCESS_CODES.CATALOG, message: 'Catalog fetched' },
  QUOTE: { code: STORE_SUCCESS_CODES.QUOTE, message: 'Selection quoted' },
  CHECKOUT: { code: STORE_SUCCESS_CODES.CHECKOUT, message: 'Order created' },
  PAYMENT: { code: STORE_SUCCESS_CODES.PAYMENT, message: 'Payment confirmed' },
  SUBSCRIPTIONS: {
    code: STORE_SUCCESS_CODES.SUBSCRIPTIONS,
    message: 'Subscriptions fetched',
  },
  SUBSCRIPTION_CANCEL: {
    code: STORE_SUCCESS_CODES.SUBSCRIPTION_CANCEL,
    message: 'Subscription will end with the current period',
  },
  SUBSCRIPTION_ADJUST: {
    code: STORE_SUCCESS_CODES.SUBSCRIPTION_ADJUST,
    message: 'Adjustment order created',
  },
  LICENSE_KEY: {
    code: STORE_SUCCESS_CODES.LICENSE_KEY,
    message: 'License key fetched',
  },
} as const satisfies ApiResultCatalog<typeof STORE_SUCCESS_CODES>;

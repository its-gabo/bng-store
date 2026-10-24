import type {
  storeCatalogDataSchema,
  storeCatalogSuccessResponseSchema,
  storeConfirmedOrderDataSchema,
  storeConfirmedOrderSuccessResponseSchema,
  storeEmptySuccessResponseSchema,
  storePendingOrderDataSchema,
  storePendingOrderSuccessResponseSchema,
  storeQuoteBodySchema,
  storeQuoteDataSchema,
  storeQuoteSuccessResponseSchema,
  storeSelectionBodySchema,
  storeUserSubscriptionSchema,
  storeUserSubscriptionsSuccessResponseSchema,
} from './store.schemas';
import type { Static, StaticDecode } from '@sinclair/typebox';

export type StoreQuoteBody = StaticDecode<typeof storeQuoteBodySchema>;
export type StoreSelectionBody = StaticDecode<typeof storeSelectionBodySchema>;

export type StoreCatalogDto = Static<typeof storeCatalogDataSchema>;
export type StoreQuoteDto = Static<typeof storeQuoteDataSchema>;
export type StorePendingOrderDto = Static<typeof storePendingOrderDataSchema>;
export type StoreConfirmedOrderDto = Static<
  typeof storeConfirmedOrderDataSchema
>;
export type StoreUserSubscriptionDto = Static<
  typeof storeUserSubscriptionSchema
>;

export type StoreCatalogSuccessResponse = Static<
  typeof storeCatalogSuccessResponseSchema
>;
export type StoreQuoteSuccessResponse = Static<
  typeof storeQuoteSuccessResponseSchema
>;
export type StorePendingOrderSuccessResponse = Static<
  typeof storePendingOrderSuccessResponseSchema
>;
export type StoreConfirmedOrderSuccessResponse = Static<
  typeof storeConfirmedOrderSuccessResponseSchema
>;
export type StoreUserSubscriptionsSuccessResponse = Static<
  typeof storeUserSubscriptionsSuccessResponseSchema
>;
export type StoreEmptySuccessResponse = Static<
  typeof storeEmptySuccessResponseSchema
>;

import { Type } from '@sinclair/typebox';

import { createApiSuccessResponseSchema } from '../../common/http/response/response.schemas';
import {
  dateTimeSchema,
  uuidSchema,
} from '../../common/http/validation/validation.schemas';
import {
  BILLING_PERIODS,
  CURRENCIES,
  ORDER_KINDS,
  ORDER_STATUSES,
  PAYMENT_PROVIDERS,
  STORE_SETTINGS,
  SUBSCRIPTION_STATUSES,
} from '../constants/store.constants';

const amountMinorSchema = Type.Integer({ minimum: 0 });

export const storeBillingPeriodSchema = Type.Union([
  Type.Literal(BILLING_PERIODS.MONTHLY),
  Type.Literal(BILLING_PERIODS.YEARLY),
]);

export const storeCurrencySchema = Type.Literal(CURRENCIES.PLN);

export const storeSubscriptionIdParamSchema = uuidSchema;

export const storePaymentReferenceParamSchema = Type.String({
  minLength: 1,
  maxLength: 255,
});

const storeApplicationIdsSchema = Type.Array(uuidSchema, {
  minItems: 1,
  maxItems: STORE_SETTINGS.MAX_SELECTED_APPLICATIONS,
});

export const storeQuoteBodySchema = Type.Object({
  billingPeriod: storeBillingPeriodSchema,
  applicationIds: storeApplicationIdsSchema,
});

const storeExtraApplicationIdsSchema = Type.Array(uuidSchema, {
  maxItems: STORE_SETTINGS.MAX_SELECTED_APPLICATIONS,
});

export const storeSelectionBodySchema = Type.Union([
  Type.Object(
    {
      billingPeriod: storeBillingPeriodSchema,
      bundleId: uuidSchema,
      extraApplicationIds: Type.Optional(storeExtraApplicationIdsSchema),
    },
    { additionalProperties: false },
  ),
  Type.Object(
    {
      billingPeriod: storeBillingPeriodSchema,
      applicationIds: storeApplicationIdsSchema,
    },
    { additionalProperties: false },
  ),
]);

export const storePriceSchema = Type.Object({
  billingPeriod: storeBillingPeriodSchema,
  amountMinor: amountMinorSchema,
});

export const storeCatalogApplicationSchema = Type.Object({
  id: uuidSchema,
  slug: Type.String(),
  name: Type.String(),
  description: Type.String(),
  prices: Type.Array(storePriceSchema),
});

export const storeCatalogBundleSchema = Type.Object({
  id: uuidSchema,
  slug: Type.String(),
  name: Type.String(),
  description: Type.String(),
  applicationIds: Type.Array(uuidSchema),
  prices: Type.Array(storePriceSchema),
});

export const storeCatalogDataSchema = Type.Object({
  currency: storeCurrencySchema,
  applications: Type.Array(storeCatalogApplicationSchema),
  bundles: Type.Array(storeCatalogBundleSchema),
});

export const storeSuggestedBundleSchema = Type.Object({
  bundleId: uuidSchema,
  slug: Type.String(),
  name: Type.String(),
  amountMinor: amountMinorSchema,
  extraApplicationIds: Type.Array(uuidSchema),
  totalAmountMinor: amountMinorSchema,
  savingsMinor: amountMinorSchema,
});

export const storeQuoteDataSchema = Type.Object({
  billingPeriod: storeBillingPeriodSchema,
  currency: storeCurrencySchema,
  totalAmountMinor: amountMinorSchema,
  items: Type.Array(
    Type.Object({ applicationId: uuidSchema, amountMinor: amountMinorSchema }),
  ),
  suggestedBundle: Type.Union([storeSuggestedBundleSchema, Type.Null()]),
});

export const storePendingOrderDataSchema = Type.Object({
  orderId: uuidSchema,
  kind: Type.Union([
    Type.Literal(ORDER_KINDS.PURCHASE),
    Type.Literal(ORDER_KINDS.ADJUSTMENT),
    Type.Literal(ORDER_KINDS.RENEWAL),
  ]),
  status: Type.Union([
    Type.Literal(ORDER_STATUSES.PENDING),
    Type.Literal(ORDER_STATUSES.PAID),
    Type.Literal(ORDER_STATUSES.FAILED),
    Type.Literal(ORDER_STATUSES.CANCELLED),
    Type.Literal(ORDER_STATUSES.EXPIRED),
  ]),
  billingPeriod: storeBillingPeriodSchema,
  totalAmountMinor: amountMinorSchema,
  currency: storeCurrencySchema,
  paymentProvider: Type.Literal(PAYMENT_PROVIDERS.MOCK),
  paymentReference: Type.String(),
  expiresAt: dateTimeSchema,
});

export const storeConfirmedOrderDataSchema = Type.Object({
  orderId: uuidSchema,
  subscriptionId: uuidSchema,
  licenseKey: Type.Union([Type.String(), Type.Null()]),
});

export const storeUserSubscriptionSchema = Type.Object({
  id: uuidSchema,
  status: Type.Union([
    Type.Literal(SUBSCRIPTION_STATUSES.ACTIVE),
    Type.Literal(SUBSCRIPTION_STATUSES.CANCELLED),
    Type.Literal(SUBSCRIPTION_STATUSES.EXPIRED),
  ]),
  billingPeriod: storeBillingPeriodSchema,
  bundle: Type.Union([
    Type.Object({ id: uuidSchema, name: Type.String() }),
    Type.Null(),
  ]),
  applications: Type.Array(
    Type.Object({ id: uuidSchema, slug: Type.String(), name: Type.String() }),
  ),
  currentPeriodStart: dateTimeSchema,
  currentPeriodEnd: dateTimeSchema,
  cancelAtPeriodEnd: Type.Boolean(),
});

export const storeUserSubscriptionsDataSchema = Type.Array(
  storeUserSubscriptionSchema,
);

export const storeUserLicenseKeySchema = Type.Object({
  keyHint: Type.String(),
  issuedAt: dateTimeSchema,
});

export const storeUserLicenseKeyDataSchema = Type.Union([
  storeUserLicenseKeySchema,
  Type.Null(),
]);

export const storeEmptyDataSchema = Type.Object({});

export const storeCatalogSuccessResponseSchema = createApiSuccessResponseSchema(
  storeCatalogDataSchema,
);
export const storeQuoteSuccessResponseSchema =
  createApiSuccessResponseSchema(storeQuoteDataSchema);
export const storePendingOrderSuccessResponseSchema =
  createApiSuccessResponseSchema(storePendingOrderDataSchema);
export const storeConfirmedOrderSuccessResponseSchema =
  createApiSuccessResponseSchema(storeConfirmedOrderDataSchema);
export const storeUserSubscriptionsSuccessResponseSchema =
  createApiSuccessResponseSchema(storeUserSubscriptionsDataSchema);
export const storeUserLicenseKeySuccessResponseSchema =
  createApiSuccessResponseSchema(storeUserLicenseKeyDataSchema);
export const storeEmptySuccessResponseSchema =
  createApiSuccessResponseSchema(storeEmptyDataSchema);

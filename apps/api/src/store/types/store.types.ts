import type {
  BILLING_PERIODS,
  CURRENCIES,
  ORDER_KINDS,
  ORDER_REJECTION_REASONS,
  ORDER_SELECTIONS,
  ORDER_STATUSES,
  PAYMENT_PROVIDERS,
  PAYMENT_STATUSES,
  SUBSCRIPTION_STATUSES,
} from '../constants/store.constants';
import type { STORE_SUCCESS_CODES } from '../dto/store.responses';
import type { STORE_ERROR_CODES } from '../errors/store.errors';

type ValueOf<T> = T[keyof T];

export type BillingPeriod = ValueOf<typeof BILLING_PERIODS>;
export type OrderKind = ValueOf<typeof ORDER_KINDS>;
export type OrderSelection = ValueOf<typeof ORDER_SELECTIONS>;
export type OrderStatus = ValueOf<typeof ORDER_STATUSES>;
export type OrderRejectionReason = ValueOf<typeof ORDER_REJECTION_REASONS>;
export type SubscriptionStatus = ValueOf<typeof SUBSCRIPTION_STATUSES>;
export type PaymentProvider = ValueOf<typeof PAYMENT_PROVIDERS>;
export type PaymentStatus = ValueOf<typeof PAYMENT_STATUSES>;
export type Currency = ValueOf<typeof CURRENCIES>;

export type StoreSelectionInput =
  | { bundleId: string; extraApplicationIds: string[] }
  | { applicationIds: string[] };

export type StoreSelectionRequest = {
  billingPeriod: BillingPeriod;
  selection: StoreSelectionInput;
};

export type PricedOrderItem = {
  applicationId: string;
  unitAmountMinor: number | null;
};

export type PricedApplication = {
  applicationId: string;
  unitAmountMinor: number;
};

export type PricedSelection = {
  selection: OrderSelection;
  bundleId: string | null;
  billingPeriod: BillingPeriod;
  currency: Currency;
  totalAmountMinor: number;
  items: PricedOrderItem[];
};

export type PricedCustomSelection = Omit<PricedSelection, 'items'> & {
  items: PricedApplication[];
};

export type StorePrice = {
  billingPeriod: BillingPeriod;
  amountMinor: number;
};

export type StoreCatalogApplication = {
  id: string;
  slug: string;
  name: string;
  description: string;
  prices: StorePrice[];
};

export type StoreCatalogBundle = {
  id: string;
  slug: string;
  name: string;
  description: string;
  applicationIds: string[];
  prices: StorePrice[];
};

export type StoreCatalog = {
  currency: Currency;
  applications: StoreCatalogApplication[];
  bundles: StoreCatalogBundle[];
};

export type SuggestedBundle = {
  bundleId: string;
  slug: string;
  name: string;
  amountMinor: number;
  extraApplicationIds: string[];
  totalAmountMinor: number;
  savingsMinor: number;
};

export type StoreQuote = {
  billingPeriod: BillingPeriod;
  currency: Currency;
  totalAmountMinor: number;
  items: { applicationId: string; amountMinor: number }[];
  suggestedBundle: SuggestedBundle | null;
};

export type PendingOrder = {
  orderId: string;
  kind: OrderKind;
  status: OrderStatus;
  billingPeriod: BillingPeriod;
  totalAmountMinor: number;
  currency: Currency;
  paymentProvider: PaymentProvider;
  paymentReference: string;
  expiresAt: Date;
};

export type ConfirmedOrder = {
  orderId: string;
  subscriptionId: string;
  licenseKey: string | null;
};

export type OrderFulfillmentResult =
  | { isFulfilled: true; confirmedOrder: ConfirmedOrder }
  | { isFulfilled: false; rejectionReason: OrderRejectionReason };

export type UserSubscription = {
  id: string;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  bundle: { id: string; name: string } | null;
  applications: { id: string; slug: string; name: string }[];
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
};

export type UserLicenseKey = {
  keyHint: string;
  issuedAt: Date;
};

export type IssuedLicenseKey = {
  plainKey: string;
  keyHash: string;
  keyHint: string;
};

export type PaymentRequest = {
  amountMinor: number;
  currency: Currency;
};

export type CreatedPayment = {
  paymentProvider: PaymentProvider;
  paymentReference: string;
};

export type PaymentCharge = CreatedPayment & {
  paymentStatus: PaymentStatus;
};

export type CreateOrderParams = {
  userId: string;
  kind: OrderKind;
  subscriptionId: string | null;
  status: OrderStatus;
  pricedSelection: PricedSelection;
  payment: CreatedPayment;
  expiresAt: Date;
  paidAt: Date | null;
};

export type CreateSubscriptionParams = {
  userId: string;
  orderId: string;
  bundleId: string | null;
  billingPeriod: BillingPeriod;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
};

export type ReplaceSubscriptionSelectionParams = {
  subscriptionId: string;
  bundleId: string | null;
  billingPeriod: BillingPeriod;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
};

export type FindOwnedApplicationIdsParams = {
  userId: string;
  excludedSubscriptionId: string | null;
};

export type StoreSuccessCode = ValueOf<typeof STORE_SUCCESS_CODES>;
export type StoreErrorCode = ValueOf<typeof STORE_ERROR_CODES>;

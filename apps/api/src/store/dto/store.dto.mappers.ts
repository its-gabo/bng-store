import { match, P } from 'ts-pattern';

import type {
  ConfirmedOrder,
  PendingOrder,
  StoreCatalog,
  StorePrice,
  StoreQuote,
  StoreSelectionRequest,
  UserLicenseKey,
  UserSubscription,
} from '../types/store.types';
import type {
  StoreCatalogDto,
  StoreConfirmedOrderDto,
  StorePendingOrderDto,
  StoreQuoteDto,
  StoreSelectionBody,
  StoreUserLicenseKeyDto,
  StoreUserSubscriptionDto,
} from './store.dto.types';

export const toStoreSelectionRequest = (
  body: StoreSelectionBody,
): StoreSelectionRequest =>
  match(body)
    .with(
      { bundleId: P.string },
      ({ billingPeriod, bundleId, extraApplicationIds = [] }) => ({
        billingPeriod,
        selection: { bundleId, extraApplicationIds },
      }),
    )
    .with(
      { applicationIds: P.array(P.string) },
      ({ billingPeriod, applicationIds }) => ({
        billingPeriod,
        selection: { applicationIds },
      }),
    )
    .exhaustive();

const toStorePriceDto = ({ billingPeriod, amountMinor }: StorePrice) => ({
  billingPeriod,
  amountMinor,
});

export const toStoreCatalogDto = (catalog: StoreCatalog): StoreCatalogDto => ({
  currency: catalog.currency,
  applications: catalog.applications.map((application) => ({
    id: application.id,
    slug: application.slug,
    name: application.name,
    description: application.description,
    prices: application.prices.map(toStorePriceDto),
  })),
  bundles: catalog.bundles.map((bundle) => ({
    id: bundle.id,
    slug: bundle.slug,
    name: bundle.name,
    description: bundle.description,
    applicationIds: bundle.applicationIds,
    prices: bundle.prices.map(toStorePriceDto),
  })),
});

export const toStoreQuoteDto = (quote: StoreQuote): StoreQuoteDto => ({
  billingPeriod: quote.billingPeriod,
  currency: quote.currency,
  totalAmountMinor: quote.totalAmountMinor,
  items: quote.items.map(({ applicationId, amountMinor }) => ({
    applicationId,
    amountMinor,
  })),
  suggestedBundle: quote.suggestedBundle && {
    bundleId: quote.suggestedBundle.bundleId,
    slug: quote.suggestedBundle.slug,
    name: quote.suggestedBundle.name,
    amountMinor: quote.suggestedBundle.amountMinor,
    extraApplicationIds: quote.suggestedBundle.extraApplicationIds,
    totalAmountMinor: quote.suggestedBundle.totalAmountMinor,
    savingsMinor: quote.suggestedBundle.savingsMinor,
  },
});

export const toStorePendingOrderDto = (
  order: PendingOrder,
): StorePendingOrderDto => ({
  orderId: order.orderId,
  kind: order.kind,
  status: order.status,
  billingPeriod: order.billingPeriod,
  totalAmountMinor: order.totalAmountMinor,
  currency: order.currency,
  paymentProvider: order.paymentProvider,
  paymentReference: order.paymentReference,
  expiresAt: order.expiresAt.toISOString(),
});

export const toStoreConfirmedOrderDto = (
  order: ConfirmedOrder,
): StoreConfirmedOrderDto => ({
  orderId: order.orderId,
  subscriptionId: order.subscriptionId,
  licenseKey: order.licenseKey,
});

export const toStoreUserSubscriptionDto = (
  subscription: UserSubscription,
): StoreUserSubscriptionDto => ({
  id: subscription.id,
  status: subscription.status,
  billingPeriod: subscription.billingPeriod,
  bundle: subscription.bundle && {
    id: subscription.bundle.id,
    name: subscription.bundle.name,
  },
  applications: subscription.applications.map(({ id, slug, name }) => ({
    id,
    slug,
    name,
  })),
  currentPeriodStart: subscription.currentPeriodStart.toISOString(),
  currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
  cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
});

export const toStoreUserLicenseKeyDto = (
  licenseKey: UserLicenseKey | null,
): StoreUserLicenseKeyDto =>
  licenseKey && {
    keyHint: licenseKey.keyHint,
    issuedAt: licenseKey.issuedAt.toISOString(),
  };

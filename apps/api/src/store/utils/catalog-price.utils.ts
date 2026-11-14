import { STORE_SETTINGS } from '../constants/store.constants';

import type { ApplicationEntity } from '../db/application.entity';
import type {
  BillingPeriod,
  Currency,
  PricedApplication,
  StorePrice,
} from '../types/store.types';

type CurrencyPrice = StorePrice & { currency: Currency };

export const findStoreCurrencyPrice = <TPrice extends CurrencyPrice>(
  prices: TPrice[],
  billingPeriod: BillingPeriod,
): TPrice | undefined =>
  prices.find(
    (price) =>
      price.billingPeriod === billingPeriod &&
      price.currency === STORE_SETTINGS.CURRENCY,
  );

export const selectStoreCurrencyPrices = (
  prices: CurrencyPrice[],
): StorePrice[] =>
  prices
    .filter(({ currency }) => currency === STORE_SETTINGS.CURRENCY)
    .map(({ billingPeriod, amountMinor }) => ({ billingPeriod, amountMinor }));

/** Returns the application as a priced item, or nothing when it has no price for the period. */
export const priceApplicationForPeriod = (
  application: ApplicationEntity,
  billingPeriod: BillingPeriod,
): PricedApplication[] => {
  const price = findStoreCurrencyPrice(application.prices ?? [], billingPeriod);

  if (!price) return [];

  return [
    { applicationId: application.id, unitAmountMinor: price.amountMinor },
  ];
};

export const sumUnitAmounts = (items: PricedApplication[]): number =>
  items.reduce((total, { unitAmountMinor }) => total + unitAmountMinor, 0);

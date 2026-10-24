import { findStoreCurrencyPrice } from './catalog-price.utils';

import type { BundleEntity } from '../db/bundle.entity';
import type { PricedSelection, SuggestedBundle } from '../types/store.types';

export const listBundleApplicationIds = (bundle: BundleEntity): string[] =>
  (bundle.bundleApplications ?? []).map(({ applicationId }) => applicationId);

/**
 * Picks the cheapest bundle that contains every selected application and
 * costs no more than the selection itself.
 */
export const findCheapestBundleCoveringSelection = (
  bundles: BundleEntity[],
  pricedSelection: PricedSelection,
): SuggestedBundle | null => {
  const [cheapestSuggestion] = bundles
    .flatMap((bundle) => toBundleSuggestion(bundle, pricedSelection))
    .sort((left, right) => left.amountMinor - right.amountMinor);

  return cheapestSuggestion ?? null;
};

const toBundleSuggestion = (
  bundle: BundleEntity,
  pricedSelection: PricedSelection,
): SuggestedBundle[] => {
  const { billingPeriod, totalAmountMinor, items } = pricedSelection;

  const bundlePrice = findStoreCurrencyPrice(
    bundle.prices ?? [],
    billingPeriod,
  );
  const bundleApplicationIds = new Set(listBundleApplicationIds(bundle));
  const coversSelection = items.every(({ applicationId }) =>
    bundleApplicationIds.has(applicationId),
  );

  if (!bundlePrice || !coversSelection) return [];
  if (bundlePrice.amountMinor > totalAmountMinor) return [];

  return [
    {
      bundleId: bundle.id,
      slug: bundle.slug,
      name: bundle.name,
      amountMinor: bundlePrice.amountMinor,
      savingsMinor: totalAmountMinor - bundlePrice.amountMinor,
    },
  ];
};

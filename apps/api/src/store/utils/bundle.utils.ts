import { findStoreCurrencyPrice, sumUnitAmounts } from './catalog-price.utils';

import type { BundleEntity } from '../db/bundle.entity';
import type {
  PricedCustomSelection,
  SuggestedBundle,
} from '../types/store.types';

export const listBundleApplicationIds = (bundle: BundleEntity): string[] =>
  (bundle.bundleApplications ?? []).map(({ applicationId }) => applicationId);

/**
 * Picks the bundle that saves the most when it replaces the selected
 * applications it contains. Selected applications outside the bundle stay in
 * the suggestion as extras, so the suggested total is the bundle price plus
 * those extras and never exceeds what the selection costs on its own.
 */
export const findMostSavingBundleForSelection = (
  bundles: BundleEntity[],
  pricedSelection: PricedCustomSelection,
): SuggestedBundle | null => {
  const [mostSavingSuggestion] = bundles
    .flatMap((bundle) => toBundleSuggestion(bundle, pricedSelection))
    .sort(
      (left, right) =>
        right.savingsMinor - left.savingsMinor ||
        left.totalAmountMinor - right.totalAmountMinor,
    );

  return mostSavingSuggestion ?? null;
};

const toBundleSuggestion = (
  bundle: BundleEntity,
  pricedSelection: PricedCustomSelection,
): SuggestedBundle[] => {
  const { billingPeriod, totalAmountMinor, items } = pricedSelection;

  const bundlePrice = findStoreCurrencyPrice(
    bundle.prices ?? [],
    billingPeriod,
  );
  const bundleApplicationIds = new Set(listBundleApplicationIds(bundle));
  const extraItems = items.filter(
    ({ applicationId }) => !bundleApplicationIds.has(applicationId),
  );
  const containsSelectedApplication = extraItems.length < items.length;

  if (!bundlePrice || !containsSelectedApplication) return [];

  const totalWithBundleAmountMinor =
    bundlePrice.amountMinor + sumUnitAmounts(extraItems);

  if (totalWithBundleAmountMinor > totalAmountMinor) return [];

  return [
    {
      bundleId: bundle.id,
      slug: bundle.slug,
      name: bundle.name,
      amountMinor: bundlePrice.amountMinor,
      extraApplicationIds: extraItems.map(({ applicationId }) => applicationId),
      totalAmountMinor: totalWithBundleAmountMinor,
      savingsMinor: totalAmountMinor - totalWithBundleAmountMinor,
    },
  ];
};

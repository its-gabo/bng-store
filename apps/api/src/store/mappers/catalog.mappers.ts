import { listBundleApplicationIds } from '../utils/bundle.utils';
import { selectStoreCurrencyPrices } from '../utils/catalog-price.utils';

import type { ApplicationEntity } from '../db/application.entity';
import type { BundleEntity } from '../db/bundle.entity';
import type {
  StoreCatalogApplication,
  StoreCatalogBundle,
} from '../types/store.types';

export const toStoreCatalogApplication = (
  application: ApplicationEntity,
): StoreCatalogApplication => ({
  id: application.id,
  slug: application.slug,
  name: application.name,
  description: application.description,
  prices: selectStoreCurrencyPrices(application.prices ?? []),
});

export const toStoreCatalogBundle = (
  bundle: BundleEntity,
): StoreCatalogBundle => ({
  id: bundle.id,
  slug: bundle.slug,
  name: bundle.name,
  description: bundle.description,
  applicationIds: listBundleApplicationIds(bundle),
  prices: selectStoreCurrencyPrices(bundle.prices ?? []),
});

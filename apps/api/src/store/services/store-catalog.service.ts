import { Injectable } from '@nestjs/common';
import { match, P } from 'ts-pattern';

import { DomainError } from '../../common/errors/domain-error';
import { ORDER_SELECTIONS, STORE_SETTINGS } from '../constants/store.constants';
import { STORE_ERRORS } from '../errors/store.errors';
import {
  toStoreCatalogApplication,
  toStoreCatalogBundle,
} from '../mappers/catalog.mappers';
import { StoreCatalogRepository } from '../repository/store-catalog.repository';
import {
  findMostSavingBundleForSelection,
  listBundleApplicationIds,
} from '../utils/bundle.utils';
import {
  findStoreCurrencyPrice,
  priceApplicationForPeriod,
  sumUnitAmounts,
} from '../utils/catalog-price.utils';

import type {
  BillingPeriod,
  PricedApplication,
  PricedCustomSelection,
  PricedSelection,
  StoreCatalog,
  StoreQuote,
  StoreSelectionRequest,
  SuggestedBundle,
} from '../types/store.types';

@Injectable()
export class StoreCatalogService {
  constructor(
    private readonly storeCatalogRepository: StoreCatalogRepository,
  ) {}

  async getCatalog(): Promise<StoreCatalog> {
    const [applications, bundles] = await Promise.all([
      this.storeCatalogRepository.findActiveApplications(),
      this.storeCatalogRepository.findActiveBundles(),
    ]);

    return {
      currency: STORE_SETTINGS.CURRENCY,
      applications: applications.map(toStoreCatalogApplication),
      bundles: bundles.map(toStoreCatalogBundle),
    };
  }

  /**
   * Prices a custom selection and suggests the bundle that saves the most
   * when it replaces the selected applications it contains.
   */
  async quoteCustomSelection(params: {
    billingPeriod: BillingPeriod;
    applicationIds: string[];
  }): Promise<StoreQuote> {
    const { billingPeriod, applicationIds } = params;

    const pricedSelection = await this.priceCustomSelection(
      billingPeriod,
      applicationIds,
    );
    const suggestedBundle =
      await this.findMostSavingBundleForSelection(pricedSelection);

    return {
      billingPeriod,
      currency: pricedSelection.currency,
      totalAmountMinor: pricedSelection.totalAmountMinor,
      items: pricedSelection.items.map(
        ({ applicationId, unitAmountMinor }) => ({
          applicationId,
          amountMinor: unitAmountMinor,
        }),
      ),
      suggestedBundle,
    };
  }

  async priceSelection(
    request: StoreSelectionRequest,
  ): Promise<PricedSelection> {
    const { billingPeriod, selection } = request;

    return match(selection)
      .with({ bundleId: P.string }, ({ bundleId, extraApplicationIds }) =>
        this.priceBundleSelection({
          billingPeriod,
          bundleId,
          extraApplicationIds,
        }),
      )
      .with({ applicationIds: P.array(P.string) }, ({ applicationIds }) =>
        this.priceCustomSelection(billingPeriod, applicationIds),
      )
      .exhaustive();
  }

  /**
   * Prices a bundle together with extra applications bought next to it.
   * Extras the bundle already contains are ignored.
   */
  private async priceBundleSelection(params: {
    billingPeriod: BillingPeriod;
    bundleId: string;
    extraApplicationIds: string[];
  }): Promise<PricedSelection> {
    const { billingPeriod, bundleId, extraApplicationIds } = params;

    const bundle =
      await this.storeCatalogRepository.findActiveBundleById(bundleId);
    const bundlePrice =
      bundle && findStoreCurrencyPrice(bundle.prices ?? [], billingPeriod);

    if (!bundle || !bundlePrice) {
      throw new DomainError(STORE_ERRORS.BUNDLE_NOT_FOUND);
    }

    const bundleApplicationIds = listBundleApplicationIds(bundle);
    const extraItems = await this.priceApplications(
      billingPeriod,
      extraApplicationIds.filter(
        (applicationId) => !bundleApplicationIds.includes(applicationId),
      ),
    );

    return {
      selection: ORDER_SELECTIONS.BUNDLE,
      bundleId: bundle.id,
      billingPeriod,
      currency: STORE_SETTINGS.CURRENCY,
      totalAmountMinor: bundlePrice.amountMinor + sumUnitAmounts(extraItems),
      items: [
        ...bundleApplicationIds.map((applicationId) => ({
          applicationId,
          unitAmountMinor: null,
        })),
        ...extraItems,
      ],
    };
  }

  private async priceCustomSelection(
    billingPeriod: BillingPeriod,
    applicationIds: string[],
  ): Promise<PricedCustomSelection> {
    const items = await this.priceApplications(billingPeriod, applicationIds);

    return {
      selection: ORDER_SELECTIONS.CUSTOM,
      bundleId: null,
      billingPeriod,
      currency: STORE_SETTINGS.CURRENCY,
      totalAmountMinor: sumUnitAmounts(items),
      items,
    };
  }

  private async priceApplications(
    billingPeriod: BillingPeriod,
    applicationIds: string[],
  ): Promise<PricedApplication[]> {
    const uniqueApplicationIds = [...new Set(applicationIds)];

    const applications =
      await this.storeCatalogRepository.findActiveApplicationsByIds(
        uniqueApplicationIds,
      );

    const items = applications.flatMap((application) =>
      priceApplicationForPeriod(application, billingPeriod),
    );

    if (items.length !== uniqueApplicationIds.length) {
      throw new DomainError(STORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    return items;
  }

  private async findMostSavingBundleForSelection(
    pricedSelection: PricedCustomSelection,
  ): Promise<SuggestedBundle | null> {
    const bundles = await this.storeCatalogRepository.findActiveBundles();

    return findMostSavingBundleForSelection(bundles, pricedSelection);
  }
}

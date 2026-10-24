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
  findCheapestBundleCoveringSelection,
  listBundleApplicationIds,
} from '../utils/bundle.utils';
import {
  findStoreCurrencyPrice,
  priceApplicationForPeriod,
  sumUnitAmounts,
} from '../utils/catalog-price.utils';

import type {
  BillingPeriod,
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
   * Prices a custom selection and suggests the cheapest active bundle that
   * covers every selected application for no more than the selection costs.
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
      await this.findCheapestBundleCoveringSelection(pricedSelection);

    return {
      billingPeriod,
      currency: pricedSelection.currency,
      totalAmountMinor: pricedSelection.totalAmountMinor,
      items: pricedSelection.items.map(
        ({ applicationId, unitAmountMinor }) => ({
          applicationId,
          amountMinor: unitAmountMinor ?? 0,
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
      .with({ bundleId: P.string }, ({ bundleId }) =>
        this.priceBundleSelection(billingPeriod, bundleId),
      )
      .with({ applicationIds: P.array(P.string) }, ({ applicationIds }) =>
        this.priceCustomSelection(billingPeriod, applicationIds),
      )
      .exhaustive();
  }

  private async priceBundleSelection(
    billingPeriod: BillingPeriod,
    bundleId: string,
  ): Promise<PricedSelection> {
    const bundle =
      await this.storeCatalogRepository.findActiveBundleById(bundleId);
    const bundlePrice =
      bundle && findStoreCurrencyPrice(bundle.prices ?? [], billingPeriod);

    if (!bundle || !bundlePrice) {
      throw new DomainError(STORE_ERRORS.BUNDLE_NOT_FOUND);
    }

    return {
      selection: ORDER_SELECTIONS.BUNDLE,
      bundleId: bundle.id,
      billingPeriod,
      currency: STORE_SETTINGS.CURRENCY,
      totalAmountMinor: bundlePrice.amountMinor,
      items: listBundleApplicationIds(bundle).map((applicationId) => ({
        applicationId,
        unitAmountMinor: null,
      })),
    };
  }

  private async priceCustomSelection(
    billingPeriod: BillingPeriod,
    applicationIds: string[],
  ): Promise<PricedSelection> {
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

    return {
      selection: ORDER_SELECTIONS.CUSTOM,
      bundleId: null,
      billingPeriod,
      currency: STORE_SETTINGS.CURRENCY,
      totalAmountMinor: sumUnitAmounts(items),
      items,
    };
  }

  private async findCheapestBundleCoveringSelection(
    pricedSelection: PricedSelection,
  ): Promise<SuggestedBundle | null> {
    const bundles = await this.storeCatalogRepository.findActiveBundles();

    return findCheapestBundleCoveringSelection(bundles, pricedSelection);
  }
}

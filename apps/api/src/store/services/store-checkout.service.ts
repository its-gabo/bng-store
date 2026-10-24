import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DomainError } from '../../common/errors/domain-error';
import { addMinutes } from '../../common/utils/date.utils';
import { ORDER_KINDS, ORDER_STATUSES } from '../constants/store.constants';
import { STORE_ERRORS } from '../errors/store.errors';
import { toPendingOrder } from '../mappers/order.mappers';
import { PaymentGateway } from '../ports/payment-gateway';
import { StoreOrdersRepository } from '../repository/store-orders.repository';
import { StoreSubscriptionsRepository } from '../repository/store-subscriptions.repository';
import { isSubscriptionAdjustable } from '../utils/subscription.utils';

import { StoreCatalogService } from './store-catalog.service';
import { StoreOwnershipService } from './store-ownership.service';

import type { StoreConfig } from '../../config/store/store.types';
import type {
  OrderKind,
  PendingOrder,
  PricedSelection,
  StoreSelectionRequest,
} from '../types/store.types';

@Injectable()
export class StoreCheckoutService {
  constructor(
    private readonly storeCatalogService: StoreCatalogService,
    private readonly storeOwnershipService: StoreOwnershipService,
    private readonly storeOrdersRepository: StoreOrdersRepository,
    private readonly storeSubscriptionsRepository: StoreSubscriptionsRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly configService: ConfigService<StoreConfig, true>,
  ) {}

  /**
   * Creates a pending purchase order for a bundle or a custom selection.
   * The subscription and license key are created once the payment is
   * confirmed.
   */
  async checkoutSelection(
    userId: string,
    request: StoreSelectionRequest,
  ): Promise<PendingOrder> {
    const pricedSelection =
      await this.storeCatalogService.priceSelection(request);

    return this.placePendingOrder({
      userId,
      kind: ORDER_KINDS.PURCHASE,
      subscriptionId: null,
      pricedSelection,
    });
  }

  /**
   * Creates a pending order that replaces the applications and billing
   * period of an active monthly subscription once it is paid.
   */
  async requestSubscriptionAdjustment(
    userId: string,
    subscriptionId: string,
    request: StoreSelectionRequest,
  ): Promise<PendingOrder> {
    const subscription =
      await this.storeSubscriptionsRepository.findUserSubscription({
        userId,
        subscriptionId,
      });

    if (!subscription) {
      throw new DomainError(STORE_ERRORS.SUBSCRIPTION_NOT_FOUND);
    }

    if (!isSubscriptionAdjustable(subscription)) {
      throw new DomainError(STORE_ERRORS.SUBSCRIPTION_NOT_ADJUSTABLE);
    }

    const pricedSelection =
      await this.storeCatalogService.priceSelection(request);

    return this.placePendingOrder({
      userId,
      kind: ORDER_KINDS.ADJUSTMENT,
      subscriptionId,
      pricedSelection,
    });
  }

  private async placePendingOrder(params: {
    userId: string;
    kind: OrderKind;
    subscriptionId: string | null;
    pricedSelection: PricedSelection;
  }): Promise<PendingOrder> {
    const { userId, kind, subscriptionId, pricedSelection } = params;

    const order = await this.storeOrdersRepository.transaction(
      async (manager) => {
        const alreadyOwnedApplicationIds =
          await this.storeOwnershipService.lockAndFindAlreadyOwnedApplicationIds(
            {
              userId,
              applicationIds: pricedSelection.items.map(
                ({ applicationId }) => applicationId,
              ),
              excludedSubscriptionId: subscriptionId,
            },
            manager,
          );

        if (alreadyOwnedApplicationIds.length > 0) {
          throw new DomainError(STORE_ERRORS.APPLICATIONS_ALREADY_OWNED);
        }

        const payment = await this.paymentGateway.createPayment({
          amountMinor: pricedSelection.totalAmountMinor,
          currency: pricedSelection.currency,
        });

        const createdOrder = await this.storeOrdersRepository.createOrder(
          {
            userId,
            kind,
            subscriptionId,
            status: ORDER_STATUSES.PENDING,
            pricedSelection,
            payment,
            expiresAt: addMinutes(
              new Date(),
              this.configService.get('store.STORE_PENDING_ORDER_TTL_MINUTES', {
                infer: true,
              }),
            ),
            paidAt: null,
          },
          manager,
        );

        await this.storeOrdersRepository.createOrderItems(
          createdOrder.id,
          pricedSelection.items,
          manager,
        );

        return createdOrder;
      },
    );

    return toPendingOrder(order);
  }
}

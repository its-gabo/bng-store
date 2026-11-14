import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { match } from 'ts-pattern';

import {
  ORDER_KINDS,
  PAYMENT_STATUSES,
  SUBSCRIPTION_STATUSES,
} from '../constants/store.constants';
import {
  toRenewalOrderPayment,
  toRenewedSelection,
} from '../mappers/order.mappers';
import { PaymentGateway } from '../ports/payment-gateway';
import { StoreOrdersRepository } from '../repository/store-orders.repository';
import { StoreSubscriptionsRepository } from '../repository/store-subscriptions.repository';
import { calculateBillingPeriodEnd } from '../utils/billing-period.utils';

import type { StoreConfig } from '../../config/store/store.types';
import type { SubscriptionEntity } from '../db/subscription.entity';
import type { EntityManager } from 'typeorm';

@Injectable()
export class StoreSubscriptionRenewalService {
  constructor(
    private readonly storeOrdersRepository: StoreOrdersRepository,
    private readonly storeSubscriptionsRepository: StoreSubscriptionsRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly configService: ConfigService<StoreConfig, true>,
  ) {}

  async expireUnpaidOrders(now: Date): Promise<number> {
    return this.storeOrdersRepository.expirePendingOrders(now);
  }

  async findDueSubscriptionIds(now: Date): Promise<string[]> {
    return this.storeSubscriptionsRepository.findDueSubscriptionIds({
      now,
      limit: this.configService.get('store.STORE_MAINTENANCE_BATCH_SIZE', {
        infer: true,
      }),
    });
  }

  /**
   * Closes a subscription whose period has ended: it is cancelled when the
   * user asked for that, otherwise renewed at the price of its last paid
   * order, or expired when the renewal charge fails. Subscriptions locked by
   * another worker are skipped.
   */
  async closeEndedSubscriptionPeriod(
    subscriptionId: string,
    now: Date,
  ): Promise<void> {
    await this.storeSubscriptionsRepository.transaction(async (manager) => {
      const subscription =
        await this.storeSubscriptionsRepository.lockDueSubscription(
          { subscriptionId, now },
          manager,
        );

      if (!subscription) return;

      if (subscription.cancelAtPeriodEnd) {
        await this.storeSubscriptionsRepository.updateSubscriptionStatus(
          { subscriptionId, status: SUBSCRIPTION_STATUSES.CANCELLED },
          manager,
        );
        return;
      }

      await this.renewSubscription(subscription, { now, manager });
    });
  }

  private async renewSubscription(
    subscription: SubscriptionEntity,
    context: { now: Date; manager: EntityManager },
  ): Promise<void> {
    const { now, manager } = context;

    const latestPaidOrder =
      await this.storeOrdersRepository.findLatestPaidOrderOfSubscription(
        {
          subscriptionId: subscription.id,
          purchaseOrderId: subscription.orderId,
        },
        manager,
      );

    if (!latestPaidOrder) {
      throw new Error(`Subscription ${subscription.id} has no paid order`);
    }

    const renewedSelection = toRenewedSelection(
      latestPaidOrder,
      subscription.billingPeriod,
    );

    const charge = await this.paymentGateway.chargeSavedPaymentMethod({
      amountMinor: renewedSelection.totalAmountMinor,
      currency: renewedSelection.currency,
    });

    const renewalOrderPayment = toRenewalOrderPayment(
      charge.paymentStatus,
      now,
    );

    const renewalOrder = await this.storeOrdersRepository.createOrder(
      {
        userId: subscription.userId,
        kind: ORDER_KINDS.RENEWAL,
        subscriptionId: subscription.id,
        status: renewalOrderPayment.status,
        pricedSelection: renewedSelection,
        payment: charge,
        expiresAt: now,
        paidAt: renewalOrderPayment.paidAt,
      },
      manager,
    );

    await this.storeOrdersRepository.createOrderItems(
      renewalOrder.id,
      renewedSelection.items,
      manager,
    );

    await match(charge.paymentStatus)
      .with(PAYMENT_STATUSES.SUCCEEDED, () =>
        this.storeSubscriptionsRepository.updateSubscriptionPeriod(
          {
            subscriptionId: subscription.id,
            currentPeriodStart: subscription.currentPeriodEnd,
            currentPeriodEnd: calculateBillingPeriodEnd(
              subscription.currentPeriodEnd,
              subscription.billingPeriod,
            ),
          },
          manager,
        ),
      )
      .with(PAYMENT_STATUSES.FAILED, () =>
        this.storeSubscriptionsRepository.updateSubscriptionStatus(
          {
            subscriptionId: subscription.id,
            status: SUBSCRIPTION_STATUSES.EXPIRED,
          },
          manager,
        ),
      )
      .exhaustive();
  }
}

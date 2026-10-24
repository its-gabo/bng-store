import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import {
  ORDER_KINDS,
  ORDER_REJECTION_REASONS,
  ORDER_STATUSES,
  PAYMENT_PROVIDERS,
} from '../constants/store.constants';
import { createOrderRejectedError } from '../errors/order-rejection.errors';
import { LicenseKeyIssuer } from '../ports/license-key-issuer';
import { StoreOrdersRepository } from '../repository/store-orders.repository';
import { StoreSubscriptionsRepository } from '../repository/store-subscriptions.repository';
import { calculateBillingPeriodEnd } from '../utils/billing-period.utils';
import {
  assertOrderAwaitsPayment,
  requireOrderSubscriptionId,
} from '../utils/order.utils';
import { isSubscriptionAdjustable } from '../utils/subscription.utils';

import { StoreOwnershipService } from './store-ownership.service';

import type { OrderEntity } from '../db/order.entity';
import type {
  ConfirmedOrder,
  OrderFulfillmentResult,
  OrderRejectionReason,
} from '../types/store.types';
import type { EntityManager } from 'typeorm';

type PaidOrder = {
  order: OrderEntity;
  applicationIds: string[];
  paidAt: Date;
};

@Injectable()
export class StoreOrderFulfillmentService {
  constructor(
    private readonly storeOrdersRepository: StoreOrdersRepository,
    private readonly storeSubscriptionsRepository: StoreSubscriptionsRepository,
    private readonly storeOwnershipService: StoreOwnershipService,
    private readonly licenseKeyIssuer: LicenseKeyIssuer,
  ) {}

  /**
   * Simulates the payment provider confirming a pending order. Ownership is
   * checked again because another order may have been paid in the meantime;
   * a conflicting order is marked as failed instead of being fulfilled.
   */
  async confirmMockPayment(
    userId: string,
    paymentReference: string,
  ): Promise<ConfirmedOrder> {
    const fulfillmentResult = await this.storeOrdersRepository.transaction(
      async (manager): Promise<OrderFulfillmentResult> => {
        const paidAt = new Date();

        const lockedOrder =
          await this.storeOrdersRepository.lockOrderByPaymentReference(
            { paymentProvider: PAYMENT_PROVIDERS.MOCK, paymentReference },
            manager,
          );
        const order = assertOrderAwaitsPayment(lockedOrder, {
          userId,
          now: paidAt,
        });

        const items = await this.storeOrdersRepository.findOrderItems(
          order.id,
          manager,
        );
        const applicationIds = items.map(({ applicationId }) => applicationId);

        const rejectionReason = await this.findOrderRejectionReason(
          order,
          applicationIds,
          manager,
        );

        if (rejectionReason) {
          await this.storeOrdersRepository.updateOrderStatus(
            { orderId: order.id, status: ORDER_STATUSES.FAILED },
            manager,
          );

          return { isFulfilled: false, rejectionReason };
        }

        await this.storeOrdersRepository.markOrderPaid(
          { orderId: order.id, paidAt },
          manager,
        );

        const confirmedOrder = await this.fulfillPaidOrder(
          { order, applicationIds, paidAt },
          manager,
        );

        return { isFulfilled: true, confirmedOrder };
      },
    );

    return match(fulfillmentResult)
      .with({ isFulfilled: true }, ({ confirmedOrder }) => confirmedOrder)
      .with({ isFulfilled: false }, ({ rejectionReason }) => {
        throw createOrderRejectedError(rejectionReason);
      })
      .exhaustive();
  }

  private async findOrderRejectionReason(
    order: OrderEntity,
    applicationIds: string[],
    manager: EntityManager,
  ): Promise<OrderRejectionReason | null> {
    return match(order.kind)
      .with(ORDER_KINDS.PURCHASE, () =>
        this.findOwnershipRejectionReason(
          { order, applicationIds, excludedSubscriptionId: null },
          manager,
        ),
      )
      .with(ORDER_KINDS.ADJUSTMENT, async () => {
        const subscriptionId = requireOrderSubscriptionId(order);
        const subscription =
          await this.storeSubscriptionsRepository.lockSubscription(
            subscriptionId,
            manager,
          );

        if (!subscription || !isSubscriptionAdjustable(subscription)) {
          return ORDER_REJECTION_REASONS.SUBSCRIPTION_NOT_ADJUSTABLE;
        }

        return this.findOwnershipRejectionReason(
          { order, applicationIds, excludedSubscriptionId: subscriptionId },
          manager,
        );
      })
      .with(ORDER_KINDS.RENEWAL, () => {
        throw new Error(`Renewal order ${order.id} cannot be confirmed`);
      })
      .exhaustive();
  }

  private async findOwnershipRejectionReason(
    params: {
      order: OrderEntity;
      applicationIds: string[];
      excludedSubscriptionId: string | null;
    },
    manager: EntityManager,
  ): Promise<OrderRejectionReason | null> {
    const { order, applicationIds, excludedSubscriptionId } = params;

    const alreadyOwnedApplicationIds =
      await this.storeOwnershipService.lockAndFindAlreadyOwnedApplicationIds(
        { userId: order.userId, applicationIds, excludedSubscriptionId },
        manager,
      );

    if (alreadyOwnedApplicationIds.length === 0) return null;

    return ORDER_REJECTION_REASONS.APPLICATIONS_ALREADY_OWNED;
  }

  private async fulfillPaidOrder(
    paidOrder: PaidOrder,
    manager: EntityManager,
  ): Promise<ConfirmedOrder> {
    return match(paidOrder.order.kind)
      .with(ORDER_KINDS.PURCHASE, () =>
        this.startSubscription(paidOrder, manager),
      )
      .with(ORDER_KINDS.ADJUSTMENT, () =>
        this.adjustSubscription(paidOrder, manager),
      )
      .with(ORDER_KINDS.RENEWAL, () => {
        throw new Error(
          `Renewal order ${paidOrder.order.id} cannot be fulfilled here`,
        );
      })
      .exhaustive();
  }

  private async startSubscription(
    paidOrder: PaidOrder,
    manager: EntityManager,
  ): Promise<ConfirmedOrder> {
    const { order, applicationIds, paidAt } = paidOrder;

    const subscription =
      await this.storeSubscriptionsRepository.createSubscription(
        {
          userId: order.userId,
          orderId: order.id,
          bundleId: order.bundleId,
          billingPeriod: order.billingPeriod,
          currentPeriodStart: paidAt,
          currentPeriodEnd: calculateBillingPeriodEnd(
            paidAt,
            order.billingPeriod,
          ),
        },
        manager,
      );

    await this.storeSubscriptionsRepository.createSubscriptionApplications(
      { subscriptionId: subscription.id, applicationIds },
      manager,
    );

    const licenseKey = this.licenseKeyIssuer.issueLicenseKey();

    await this.storeSubscriptionsRepository.createLicenseKey(
      { subscriptionId: subscription.id, licenseKey },
      manager,
    );

    return {
      orderId: order.id,
      subscriptionId: subscription.id,
      licenseKey: licenseKey.plainKey,
    };
  }

  private async adjustSubscription(
    paidOrder: PaidOrder,
    manager: EntityManager,
  ): Promise<ConfirmedOrder> {
    const { order, applicationIds, paidAt } = paidOrder;
    const subscriptionId = requireOrderSubscriptionId(order);

    await this.storeSubscriptionsRepository.deleteSubscriptionApplications(
      subscriptionId,
      manager,
    );

    await this.storeSubscriptionsRepository.createSubscriptionApplications(
      { subscriptionId, applicationIds },
      manager,
    );

    await this.storeSubscriptionsRepository.replaceSubscriptionSelection(
      {
        subscriptionId,
        bundleId: order.bundleId,
        billingPeriod: order.billingPeriod,
        currentPeriodStart: paidAt,
        currentPeriodEnd: calculateBillingPeriodEnd(
          paidAt,
          order.billingPeriod,
        ),
      },
      manager,
    );

    return { orderId: order.id, subscriptionId, licenseKey: null };
  }
}

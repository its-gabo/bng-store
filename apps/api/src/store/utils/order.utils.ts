import { DomainError } from '../../common/errors/domain-error';
import { ORDER_STATUSES } from '../constants/store.constants';
import { STORE_ERRORS } from '../errors/store.errors';

import type { OrderEntity } from '../db/order.entity';

/** Ensures the order belongs to the user and can still be paid. */
export const assertOrderAwaitsPayment = (
  order: OrderEntity | null,
  params: { userId: string; now: Date },
): OrderEntity => {
  const { userId, now } = params;

  if (!order || order.userId !== userId) {
    throw new DomainError(STORE_ERRORS.ORDER_NOT_FOUND);
  }

  if (order.status !== ORDER_STATUSES.PENDING) {
    throw new DomainError(STORE_ERRORS.ORDER_NOT_PENDING);
  }

  if (order.expiresAt <= now) {
    throw new DomainError(STORE_ERRORS.ORDER_EXPIRED);
  }

  return order;
};

export const requireOrderSubscriptionId = (order: OrderEntity): string => {
  if (!order.subscriptionId) {
    throw new Error(`Order ${order.id} is not linked to a subscription`);
  }

  return order.subscriptionId;
};

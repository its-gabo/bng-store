import { match } from 'ts-pattern';

import { ORDER_STATUSES, PAYMENT_STATUSES } from '../constants/store.constants';

import type { OrderEntity } from '../db/order.entity';
import type {
  BillingPeriod,
  OrderStatus,
  PaymentStatus,
  PendingOrder,
  PricedSelection,
} from '../types/store.types';

export const toPendingOrder = (order: OrderEntity): PendingOrder => {
  if (!order.paymentReference) {
    throw new Error(`Order ${order.id} was created without a payment`);
  }

  return {
    orderId: order.id,
    kind: order.kind,
    status: order.status,
    billingPeriod: order.billingPeriod,
    totalAmountMinor: order.totalAmountMinor,
    currency: order.currency,
    paymentProvider: order.paymentProvider,
    paymentReference: order.paymentReference,
    expiresAt: order.expiresAt,
  };
};

/** Repeats the selection and price of a paid order for the next period. */
export const toRenewedSelection = (
  latestPaidOrder: OrderEntity,
  billingPeriod: BillingPeriod,
): PricedSelection => ({
  selection: latestPaidOrder.selection,
  bundleId: latestPaidOrder.bundleId,
  billingPeriod,
  currency: latestPaidOrder.currency,
  totalAmountMinor: latestPaidOrder.totalAmountMinor,
  items: (latestPaidOrder.items ?? []).map(
    ({ applicationId, unitAmountMinor }) => ({
      applicationId,
      unitAmountMinor,
    }),
  ),
});

export const toRenewalOrderPayment = (
  paymentStatus: PaymentStatus,
  chargedAt: Date,
): { status: OrderStatus; paidAt: Date | null } =>
  match(paymentStatus)
    .with(PAYMENT_STATUSES.SUCCEEDED, () => ({
      status: ORDER_STATUSES.PAID,
      paidAt: chargedAt,
    }))
    .with(PAYMENT_STATUSES.FAILED, () => ({
      status: ORDER_STATUSES.FAILED,
      paidAt: null,
    }))
    .exhaustive();

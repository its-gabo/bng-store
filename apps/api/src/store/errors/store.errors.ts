import { DOMAIN_ERROR_KINDS } from '../../common/errors/domain-error.constants';

import type { DomainErrorCatalog } from '../../common/errors/domain-error.types';

export const STORE_ERROR_CODES = {
  BUNDLE_NOT_FOUND: 'store.selection.bundle_not_found',
  APPLICATION_NOT_FOUND: 'store.selection.application_not_found',
  APPLICATIONS_ALREADY_OWNED: 'store.checkout.applications_already_owned',
  ORDER_NOT_FOUND: 'store.payment.order_not_found',
  ORDER_NOT_PENDING: 'store.payment.order_not_pending',
  ORDER_EXPIRED: 'store.payment.order_expired',
  ORDER_REJECTED_APPLICATIONS_ALREADY_OWNED:
    'store.payment.applications_already_owned',
  ORDER_REJECTED_SUBSCRIPTION_NOT_ADJUSTABLE:
    'store.payment.subscription_not_adjustable',
  SUBSCRIPTION_NOT_FOUND: 'store.subscription.not_found',
  SUBSCRIPTION_NOT_ADJUSTABLE: 'store.subscription.not_adjustable',
  SUBSCRIPTION_NOT_CANCELLABLE: 'store.subscription.not_cancellable',
} as const;

export const STORE_ERRORS = {
  BUNDLE_NOT_FOUND: {
    kind: DOMAIN_ERROR_KINDS.NOT_FOUND,
    code: STORE_ERROR_CODES.BUNDLE_NOT_FOUND,
    message: 'Bundle not found',
    reason: 'store.bundle_not_found',
  },
  APPLICATION_NOT_FOUND: {
    kind: DOMAIN_ERROR_KINDS.NOT_FOUND,
    code: STORE_ERROR_CODES.APPLICATION_NOT_FOUND,
    message: 'Application not found',
    reason: 'store.application_not_found',
  },
  APPLICATIONS_ALREADY_OWNED: {
    kind: DOMAIN_ERROR_KINDS.CONFLICT,
    code: STORE_ERROR_CODES.APPLICATIONS_ALREADY_OWNED,
    message: 'Some applications are already in an active subscription',
    reason: 'store.applications_already_owned',
  },
  ORDER_NOT_FOUND: {
    kind: DOMAIN_ERROR_KINDS.NOT_FOUND,
    code: STORE_ERROR_CODES.ORDER_NOT_FOUND,
    message: 'Order not found',
    reason: 'store.order_not_found',
  },
  ORDER_NOT_PENDING: {
    kind: DOMAIN_ERROR_KINDS.CONFLICT,
    code: STORE_ERROR_CODES.ORDER_NOT_PENDING,
    message: 'Order is not awaiting payment',
    reason: 'store.order_not_pending',
  },
  ORDER_EXPIRED: {
    kind: DOMAIN_ERROR_KINDS.GONE,
    code: STORE_ERROR_CODES.ORDER_EXPIRED,
    message: 'Order has expired',
    reason: 'store.order_expired',
  },
  ORDER_REJECTED_APPLICATIONS_ALREADY_OWNED: {
    kind: DOMAIN_ERROR_KINDS.CONFLICT,
    code: STORE_ERROR_CODES.ORDER_REJECTED_APPLICATIONS_ALREADY_OWNED,
    message: 'Some applications are already in an active subscription',
    reason: 'store.applications_already_owned',
  },
  ORDER_REJECTED_SUBSCRIPTION_NOT_ADJUSTABLE: {
    kind: DOMAIN_ERROR_KINDS.CONFLICT,
    code: STORE_ERROR_CODES.ORDER_REJECTED_SUBSCRIPTION_NOT_ADJUSTABLE,
    message: 'Subscription can no longer be adjusted',
    reason: 'store.subscription_not_adjustable',
  },
  SUBSCRIPTION_NOT_FOUND: {
    kind: DOMAIN_ERROR_KINDS.NOT_FOUND,
    code: STORE_ERROR_CODES.SUBSCRIPTION_NOT_FOUND,
    message: 'Subscription not found',
    reason: 'store.subscription_not_found',
  },
  SUBSCRIPTION_NOT_ADJUSTABLE: {
    kind: DOMAIN_ERROR_KINDS.CONFLICT,
    code: STORE_ERROR_CODES.SUBSCRIPTION_NOT_ADJUSTABLE,
    message: 'Only active monthly subscriptions can be adjusted',
    reason: 'store.subscription_not_adjustable',
  },
  SUBSCRIPTION_NOT_CANCELLABLE: {
    kind: DOMAIN_ERROR_KINDS.CONFLICT,
    code: STORE_ERROR_CODES.SUBSCRIPTION_NOT_CANCELLABLE,
    message: 'Subscription is already cancelled or ended',
    reason: 'store.subscription_not_cancellable',
  },
} as const satisfies DomainErrorCatalog<typeof STORE_ERROR_CODES>;

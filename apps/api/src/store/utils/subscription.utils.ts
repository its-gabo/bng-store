import {
  BILLING_PERIODS,
  SUBSCRIPTION_STATUSES,
} from '../constants/store.constants';

import type { SubscriptionEntity } from '../db/subscription.entity';

/**
 * Only active monthly subscriptions can change their applications or billing
 * period; yearly subscriptions stay fixed until they end.
 */
export const isSubscriptionAdjustable = (
  subscription: Pick<SubscriptionEntity, 'status' | 'billingPeriod'>,
): boolean =>
  subscription.status === SUBSCRIPTION_STATUSES.ACTIVE &&
  subscription.billingPeriod === BILLING_PERIODS.MONTHLY;

/** A subscription can be cancelled once, while it is still active. */
export const isSubscriptionCancellable = (
  subscription: Pick<SubscriptionEntity, 'status' | 'cancelAtPeriodEnd'>,
): boolean =>
  subscription.status === SUBSCRIPTION_STATUSES.ACTIVE &&
  !subscription.cancelAtPeriodEnd;

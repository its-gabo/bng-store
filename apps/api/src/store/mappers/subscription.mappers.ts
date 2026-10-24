import type { SubscriptionEntity } from '../db/subscription.entity';
import type { UserSubscription } from '../types/store.types';

export const toUserSubscription = (
  subscription: SubscriptionEntity,
): UserSubscription => {
  const { bundle, licenseKey, subscriptionApplications = [] } = subscription;

  return {
    id: subscription.id,
    status: subscription.status,
    billingPeriod: subscription.billingPeriod,
    bundle: bundle ? { id: bundle.id, name: bundle.name } : null,
    applications: subscriptionApplications.flatMap(({ application }) =>
      application
        ? [
            {
              id: application.id,
              slug: application.slug,
              name: application.name,
            },
          ]
        : [],
    ),
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    licenseKeyHint: licenseKey?.keyHint ?? null,
  };
};

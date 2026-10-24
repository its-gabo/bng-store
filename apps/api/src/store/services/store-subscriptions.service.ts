import { Injectable } from '@nestjs/common';

import { DomainError } from '../../common/errors/domain-error';
import { STORE_ERRORS } from '../errors/store.errors';
import { toUserSubscription } from '../mappers/subscription.mappers';
import { StoreSubscriptionsRepository } from '../repository/store-subscriptions.repository';
import { isSubscriptionCancellable } from '../utils/subscription.utils';

import type { UserSubscription } from '../types/store.types';

@Injectable()
export class StoreSubscriptionsService {
  constructor(
    private readonly storeSubscriptionsRepository: StoreSubscriptionsRepository,
  ) {}

  async listUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    const subscriptions =
      await this.storeSubscriptionsRepository.findUserSubscriptionsWithDetails(
        userId,
      );

    return subscriptions.map(toUserSubscription);
  }

  /**
   * Stops the subscription from renewing. Access stays until the end of the
   * current period, when the maintenance worker marks it as cancelled.
   */
  async cancelSubscriptionAtPeriodEnd(
    userId: string,
    subscriptionId: string,
  ): Promise<void> {
    const subscription =
      await this.storeSubscriptionsRepository.findUserSubscription({
        userId,
        subscriptionId,
      });

    if (!subscription) {
      throw new DomainError(STORE_ERRORS.SUBSCRIPTION_NOT_FOUND);
    }

    if (!isSubscriptionCancellable(subscription)) {
      throw new DomainError(STORE_ERRORS.SUBSCRIPTION_NOT_CANCELLABLE);
    }

    await this.storeSubscriptionsRepository.markSubscriptionCancelledAtPeriodEnd(
      { subscriptionId, cancelledAt: new Date() },
    );
  }
}

import { Injectable } from '@nestjs/common';

import { StoreSubscriptionsRepository } from '../repository/store-subscriptions.repository';

import type { EntityManager } from 'typeorm';

@Injectable()
export class StoreOwnershipService {
  constructor(
    private readonly storeSubscriptionsRepository: StoreSubscriptionsRepository,
  ) {}

  /**
   * Locks the user's purchases for the rest of the transaction and returns
   * the requested applications the user already has in another active
   * subscription. The lock stops two parallel orders from both passing.
   */
  async lockAndFindAlreadyOwnedApplicationIds(
    params: {
      userId: string;
      applicationIds: string[];
      excludedSubscriptionId: string | null;
    },
    manager: EntityManager,
  ): Promise<string[]> {
    const { userId, applicationIds, excludedSubscriptionId } = params;

    await this.storeSubscriptionsRepository.lockUserForPurchase(
      userId,
      manager,
    );

    const ownedApplicationIds = new Set(
      await this.storeSubscriptionsRepository.findApplicationIdsOwnedByUser(
        { userId, excludedSubscriptionId },
        manager,
      ),
    );

    return applicationIds.filter((applicationId) =>
      ownedApplicationIds.has(applicationId),
    );
  }
}

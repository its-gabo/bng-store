import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, LessThanOrEqual } from 'typeorm';

import { UserEntity } from '../../users/db/user.entity';
import { SUBSCRIPTION_STATUSES } from '../constants/store.constants';
import { SubscriptionApplicationEntity } from '../db/subscription-application.entity';
import { SubscriptionEntity } from '../db/subscription.entity';

import type {
  CreateSubscriptionParams,
  FindOwnedApplicationIdsParams,
  ReplaceSubscriptionSelectionParams,
  SubscriptionStatus,
} from '../types/store.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class StoreSubscriptionsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async transaction<T>(
    work: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(work);
  }

  async lockUserForPurchase(
    userId: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager.findOne(UserEntity, {
      select: { id: true },
      where: { id: userId },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async findApplicationIdsOwnedByUser(
    params: FindOwnedApplicationIdsParams,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<string[]> {
    const { userId, excludedSubscriptionId } = params;

    const query = manager
      .createQueryBuilder(SubscriptionApplicationEntity, 'entitlement')
      .innerJoin('entitlement.subscription', 'subscription')
      .select('entitlement.applicationId', 'applicationId')
      .where('subscription.userId = :userId', { userId })
      .andWhere('subscription.status = :status', {
        status: SUBSCRIPTION_STATUSES.ACTIVE,
      });

    if (excludedSubscriptionId) {
      query.andWhere('subscription.id <> :excludedSubscriptionId', {
        excludedSubscriptionId,
      });
    }

    const rows = await query.getRawMany<{ applicationId: string }>();

    return rows.map(({ applicationId }) => applicationId);
  }

  async hasUserEndedSubscription(userId: string): Promise<boolean> {
    return this.dataSource.manager.existsBy(SubscriptionEntity, {
      userId,
      status: In([
        SUBSCRIPTION_STATUSES.CANCELLED,
        SUBSCRIPTION_STATUSES.EXPIRED,
      ]),
    });
  }

  async createSubscription(
    params: CreateSubscriptionParams,
    manager: EntityManager,
  ): Promise<SubscriptionEntity> {
    return manager.save(manager.create(SubscriptionEntity, params));
  }

  async createSubscriptionApplications(
    params: { subscriptionId: string; applicationIds: string[] },
    manager: EntityManager,
  ): Promise<void> {
    const { subscriptionId, applicationIds } = params;

    if (applicationIds.length === 0) return;

    await manager.insert(
      SubscriptionApplicationEntity,
      applicationIds.map((applicationId) => ({
        subscriptionId,
        applicationId,
      })),
    );
  }

  async deleteSubscriptionApplications(
    subscriptionId: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager.delete(SubscriptionApplicationEntity, { subscriptionId });
  }

  async replaceSubscriptionSelection(
    params: ReplaceSubscriptionSelectionParams,
    manager: EntityManager,
  ): Promise<void> {
    const {
      subscriptionId,
      bundleId,
      billingPeriod,
      currentPeriodStart,
      currentPeriodEnd,
    } = params;

    await manager.update(
      SubscriptionEntity,
      { id: subscriptionId },
      {
        bundleId,
        billingPeriod,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
      },
    );
  }

  async updateSubscriptionPeriod(
    params: {
      subscriptionId: string;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
    },
    manager: EntityManager,
  ): Promise<void> {
    const { subscriptionId, currentPeriodStart, currentPeriodEnd } = params;

    await manager.update(
      SubscriptionEntity,
      { id: subscriptionId },
      { currentPeriodStart, currentPeriodEnd },
    );
  }

  async updateSubscriptionStatus(
    params: { subscriptionId: string; status: SubscriptionStatus },
    manager: EntityManager,
  ): Promise<void> {
    const { subscriptionId, status } = params;

    await manager.update(
      SubscriptionEntity,
      { id: subscriptionId },
      { status },
    );
  }

  async markSubscriptionCancelledAtPeriodEnd(params: {
    subscriptionId: string;
    cancelledAt: Date;
  }): Promise<void> {
    const { subscriptionId, cancelledAt } = params;

    await this.dataSource.manager.update(
      SubscriptionEntity,
      { id: subscriptionId },
      { cancelAtPeriodEnd: true, cancelledAt },
    );
  }

  async findUserSubscription(params: {
    userId: string;
    subscriptionId: string;
  }): Promise<SubscriptionEntity | null> {
    const { userId, subscriptionId } = params;

    return this.dataSource.manager.findOneBy(SubscriptionEntity, {
      id: subscriptionId,
      userId,
    });
  }

  async lockSubscription(
    subscriptionId: string,
    manager: EntityManager,
  ): Promise<SubscriptionEntity | null> {
    return manager.findOne(SubscriptionEntity, {
      where: { id: subscriptionId },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async findUserSubscriptionsWithDetails(
    userId: string,
  ): Promise<SubscriptionEntity[]> {
    return this.dataSource.manager.find(SubscriptionEntity, {
      where: { userId },
      relations: {
        bundle: true,
        subscriptionApplications: { application: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findDueSubscriptionIds(params: {
    now: Date;
    limit: number;
  }): Promise<string[]> {
    const { now, limit } = params;

    const subscriptions = await this.dataSource.manager.find(
      SubscriptionEntity,
      {
        select: { id: true },
        where: {
          status: SUBSCRIPTION_STATUSES.ACTIVE,
          currentPeriodEnd: LessThanOrEqual(now),
        },
        order: { currentPeriodEnd: 'ASC' },
        take: limit,
      },
    );

    return subscriptions.map(({ id }) => id);
  }

  async lockDueSubscription(
    params: { subscriptionId: string; now: Date },
    manager: EntityManager,
  ): Promise<SubscriptionEntity | null> {
    const { subscriptionId, now } = params;

    return manager.findOne(SubscriptionEntity, {
      where: {
        id: subscriptionId,
        status: SUBSCRIPTION_STATUSES.ACTIVE,
        currentPeriodEnd: LessThanOrEqual(now),
      },
      lock: { mode: 'pessimistic_write', onLocked: 'skip_locked' },
    });
  }
}

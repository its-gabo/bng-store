import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { getErrorMessage } from '../../common/utils/error.utils';
import { STORE_CRON_JOBS } from '../constants/store.constants';
import { StoreSubscriptionRenewalService } from '../services/store-subscription-renewal.service';

import type { StoreConfig } from '../../config/store/store.types';
import type { OnModuleInit } from '@nestjs/common';

/**
 * Schedules the store maintenance cron job: expires unpaid orders and closes
 * subscription periods that have ended (renew, cancel or expire). A run is
 * skipped while the previous one is still in progress.
 */
@Injectable()
export class StoreMaintenanceScheduler implements OnModuleInit {
  private readonly logger = new Logger(StoreMaintenanceScheduler.name);

  constructor(
    private readonly storeSubscriptionRenewalService: StoreSubscriptionRenewalService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService<StoreConfig, true>,
  ) {}

  onModuleInit(): void {
    const maintenanceJob = CronJob.from({
      cronTime: this.configService.get('store.STORE_MAINTENANCE_CRON', {
        infer: true,
      }),
      onTick: () => this.expireOrdersAndCloseEndedPeriods(),
      waitForCompletion: true,
      errorHandler: (error) =>
        this.logger.error(
          `Store maintenance failed: ${getErrorMessage(error)}`,
        ),
    });

    this.schedulerRegistry.addCronJob(
      STORE_CRON_JOBS.MAINTENANCE,
      maintenanceJob,
    );

    maintenanceJob.start();
  }

  private async expireOrdersAndCloseEndedPeriods(): Promise<void> {
    const now = new Date();

    await this.storeSubscriptionRenewalService.expireUnpaidOrders(now);

    const dueSubscriptionIds =
      await this.storeSubscriptionRenewalService.findDueSubscriptionIds(now);

    for (const subscriptionId of dueSubscriptionIds) {
      await this.closeSubscriptionPeriodSafely(subscriptionId, now);
    }
  }

  private async closeSubscriptionPeriodSafely(
    subscriptionId: string,
    now: Date,
  ): Promise<void> {
    try {
      await this.storeSubscriptionRenewalService.closeEndedSubscriptionPeriod(
        subscriptionId,
        now,
      );
    } catch (error) {
      this.logger.error(
        `Failed to close period of subscription ${subscriptionId}: ${getErrorMessage(error)}`,
      );
    }
  }
}

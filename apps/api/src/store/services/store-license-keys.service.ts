import { Injectable } from '@nestjs/common';
import {
  hashLicenseKey,
  isLicenseKeyFormat,
  normalizeLicenseKey,
} from '@workspace/license-keys';

import { LICENSE_KEY_VALIDATION_STATUSES } from '../constants/store.constants';
import { LicenseKeyIssuer } from '../ports/license-key-issuer';
import { StoreLicenseKeysRepository } from '../repository/store-license-keys.repository';
import { StoreSubscriptionsRepository } from '../repository/store-subscriptions.repository';

import type {
  LicenseKeyValidation,
  UserLicenseKey,
} from '../types/store.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class StoreLicenseKeysService {
  constructor(
    private readonly storeLicenseKeysRepository: StoreLicenseKeysRepository,
    private readonly storeSubscriptionsRepository: StoreSubscriptionsRepository,
    private readonly licenseKeyIssuer: LicenseKeyIssuer,
  ) {}

  /**
   * Checks a user-entered key and returns the applications it unlocks. A key
   * is valid only while it is not revoked and its owner has at least one
   * active subscription; once all of them have ended it reports `expired`.
   */
  async validateLicenseKey(plainKey: string): Promise<LicenseKeyValidation> {
    const normalizedKey = normalizeLicenseKey(plainKey);

    if (!isLicenseKeyFormat(normalizedKey)) {
      return this.toInvalidValidation(
        LICENSE_KEY_VALIDATION_STATUSES.INVALID_FORMAT,
      );
    }

    const licenseKey =
      await this.storeLicenseKeysRepository.findLicenseKeyByHash(
        hashLicenseKey(normalizedKey),
      );

    if (!licenseKey) {
      return this.toInvalidValidation(
        LICENSE_KEY_VALIDATION_STATUSES.NOT_FOUND,
      );
    }

    if (licenseKey.revokedAt) {
      return this.toInvalidValidation(LICENSE_KEY_VALIDATION_STATUSES.REVOKED);
    }

    const applicationIds =
      await this.storeSubscriptionsRepository.findApplicationIdsOwnedByUser({
        userId: licenseKey.userId,
        excludedSubscriptionId: null,
      });

    if (applicationIds.length === 0) {
      const hasEndedSubscription =
        await this.storeSubscriptionsRepository.hasUserEndedSubscription(
          licenseKey.userId,
        );

      return this.toInvalidValidation(
        hasEndedSubscription
          ? LICENSE_KEY_VALIDATION_STATUSES.EXPIRED
          : LICENSE_KEY_VALIDATION_STATUSES.NO_ACTIVE_SUBSCRIPTION,
      );
    }

    return { status: LICENSE_KEY_VALIDATION_STATUSES.VALID, applicationIds };
  }

  async findUserLicenseKey(userId: string): Promise<UserLicenseKey | null> {
    const licenseKey =
      await this.storeLicenseKeysRepository.findUserLicenseKey(userId);

    return (
      licenseKey && {
        keyHint: licenseKey.keyHint,
        issuedAt: licenseKey.createdAt,
      }
    );
  }

  /**
   * Issues the user's single license key on their first purchase and returns
   * the plain key, which is never stored. Returns null when the user already
   * has a key; it keeps unlocking every application they subscribe to.
   * Callers must hold the user's purchase lock.
   */
  async issueLicenseKeyIfUserHasNone(
    userId: string,
    manager: EntityManager,
  ): Promise<string | null> {
    const hasLicenseKey =
      await this.storeLicenseKeysRepository.hasUserLicenseKey(userId, manager);

    if (hasLicenseKey) return null;

    const licenseKey = this.licenseKeyIssuer.issueLicenseKey();

    await this.storeLicenseKeysRepository.createLicenseKey(
      { userId, licenseKey },
      manager,
    );

    return licenseKey.plainKey;
  }

  private toInvalidValidation(
    status: LicenseKeyValidation['status'],
  ): LicenseKeyValidation {
    return { status, applicationIds: [] };
  }
}

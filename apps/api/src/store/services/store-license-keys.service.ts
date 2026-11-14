import { Injectable } from '@nestjs/common';

import { LicenseKeyIssuer } from '../ports/license-key-issuer';
import { StoreLicenseKeysRepository } from '../repository/store-license-keys.repository';

import type { UserLicenseKey } from '../types/store.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class StoreLicenseKeysService {
  constructor(
    private readonly storeLicenseKeysRepository: StoreLicenseKeysRepository,
    private readonly licenseKeyIssuer: LicenseKeyIssuer,
  ) {}

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
}

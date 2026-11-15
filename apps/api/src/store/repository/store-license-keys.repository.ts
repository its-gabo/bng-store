import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { LicenseKeyEntity } from '../db/license-key.entity';

import type { IssuedLicenseKey } from '../types/store.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class StoreLicenseKeysRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findUserLicenseKey(userId: string): Promise<LicenseKeyEntity | null> {
    return this.dataSource.manager.findOneBy(LicenseKeyEntity, { userId });
  }

  async findLicenseKeyByHash(
    keyHash: string,
  ): Promise<LicenseKeyEntity | null> {
    return this.dataSource.manager.findOneBy(LicenseKeyEntity, { keyHash });
  }

  async hasUserLicenseKey(
    userId: string,
    manager: EntityManager,
  ): Promise<boolean> {
    return manager.existsBy(LicenseKeyEntity, { userId });
  }

  async createLicenseKey(
    params: { userId: string; licenseKey: IssuedLicenseKey },
    manager: EntityManager,
  ): Promise<void> {
    const { userId, licenseKey } = params;

    await manager.insert(LicenseKeyEntity, {
      userId,
      keyHash: licenseKey.keyHash,
      keyHint: licenseKey.keyHint,
    });
  }
}

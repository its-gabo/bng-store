import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';

import { ApplicationEntity } from '../db/application.entity';
import { BundleEntity } from '../db/bundle.entity';

@Injectable()
export class StoreCatalogRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findActiveApplications(): Promise<ApplicationEntity[]> {
    return this.dataSource.manager.find(ApplicationEntity, {
      where: { isActive: true },
      relations: { prices: true },
      order: { name: 'ASC' },
    });
  }

  async findActiveApplicationsByIds(
    applicationIds: string[],
  ): Promise<ApplicationEntity[]> {
    if (applicationIds.length === 0) return [];

    return this.dataSource.manager.find(ApplicationEntity, {
      where: { id: In(applicationIds), isActive: true },
      relations: { prices: true },
    });
  }

  async findActiveBundles(): Promise<BundleEntity[]> {
    return this.dataSource.manager.find(BundleEntity, {
      where: { isActive: true },
      relations: { prices: true, bundleApplications: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findActiveBundleById(bundleId: string): Promise<BundleEntity | null> {
    return this.dataSource.manager.findOne(BundleEntity, {
      where: { id: bundleId, isActive: true },
      relations: { prices: true, bundleApplications: true },
    });
  }
}

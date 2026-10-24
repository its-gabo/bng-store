import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BundleApplicationEntity } from './bundle-application.entity';
import { BundlePriceEntity } from './bundle-price.entity';

@Entity('bundles')
export class BundleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @OneToMany(
    () => BundleApplicationEntity,
    (bundleApplication) => bundleApplication.bundle,
  )
  bundleApplications?: BundleApplicationEntity[];

  @OneToMany(() => BundlePriceEntity, (price) => price.bundle)
  prices?: BundlePriceEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

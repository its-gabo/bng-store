import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { BILLING_PERIODS } from '../constants/store.constants';

import { BundleEntity } from './bundle.entity';

import type { BillingPeriod, Currency } from '../types/store.types';
import type { Relation } from 'typeorm';

@Entity('bundle_prices')
@Unique('bundle_prices_bundle_period_currency_key', [
  'bundleId',
  'billingPeriod',
  'currency',
])
@Check('bundle_prices_amount_minor_check', '"amount_minor" >= 0')
export class BundlePriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bundle_id', type: 'uuid' })
  bundleId: string;

  @ManyToOne(() => BundleEntity, (bundle) => bundle.prices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bundle_id' })
  bundle?: Relation<BundleEntity>;

  @Column({
    name: 'billing_period',
    type: 'enum',
    enum: Object.values(BILLING_PERIODS),
    enumName: 'bundle_price_billing_period',
  })
  billingPeriod: BillingPeriod;

  @Column({ name: 'amount_minor', type: 'integer' })
  amountMinor: number;

  @Column({ type: 'char', length: 3 })
  currency: Currency;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

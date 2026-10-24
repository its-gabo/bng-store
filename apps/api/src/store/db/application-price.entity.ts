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

import { ApplicationEntity } from './application.entity';

import type { BillingPeriod, Currency } from '../types/store.types';
import type { Relation } from 'typeorm';

@Entity('application_prices')
@Unique('application_prices_application_period_currency_key', [
  'applicationId',
  'billingPeriod',
  'currency',
])
@Check('application_prices_amount_minor_check', '"amount_minor" >= 0')
export class ApplicationPriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => ApplicationEntity, (application) => application.prices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application?: Relation<ApplicationEntity>;

  @Column({
    name: 'billing_period',
    type: 'enum',
    enum: Object.values(BILLING_PERIODS),
    enumName: 'application_price_billing_period',
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

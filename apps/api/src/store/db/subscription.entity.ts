import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../users/db/user.entity';
import {
  BILLING_PERIODS,
  SUBSCRIPTION_STATUSES,
} from '../constants/store.constants';

import { BundleEntity } from './bundle.entity';
import { OrderEntity } from './order.entity';
import { SubscriptionApplicationEntity } from './subscription-application.entity';

import type { BillingPeriod, SubscriptionStatus } from '../types/store.types';
import type { Relation } from 'typeorm';

@Entity('subscriptions')
@Index('subscriptions_status_current_period_end_idx', [
  'status',
  'currentPeriodEnd',
])
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('subscriptions_user_id_idx')
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<UserEntity>;

  @Column({ name: 'order_id', type: 'uuid', unique: true })
  orderId: string;

  @OneToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id' })
  order?: Relation<OrderEntity>;

  @Column({ name: 'bundle_id', type: 'uuid', nullable: true })
  bundleId: string | null;

  @ManyToOne(() => BundleEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bundle_id' })
  bundle?: Relation<BundleEntity> | null;

  @Column({
    name: 'billing_period',
    type: 'enum',
    enum: Object.values(BILLING_PERIODS),
    enumName: 'subscription_billing_period',
  })
  billingPeriod: BillingPeriod;

  @Column({
    type: 'enum',
    enum: Object.values(SUBSCRIPTION_STATUSES),
    enumName: 'subscription_status',
    default: SUBSCRIPTION_STATUSES.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ name: 'current_period_start', type: 'timestamptz' })
  currentPeriodStart: Date;

  @Column({ name: 'current_period_end', type: 'timestamptz' })
  currentPeriodEnd: Date;

  @Column({ name: 'cancel_at_period_end', type: 'boolean', default: false })
  cancelAtPeriodEnd: boolean;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @OneToMany(
    () => SubscriptionApplicationEntity,
    (subscriptionApplication) => subscriptionApplication.subscription,
  )
  subscriptionApplications?: SubscriptionApplicationEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

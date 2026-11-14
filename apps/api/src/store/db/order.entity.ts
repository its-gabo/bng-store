import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../users/db/user.entity';
import {
  BILLING_PERIODS,
  ORDER_KINDS,
  ORDER_SELECTIONS,
  ORDER_STATUSES,
  PAYMENT_PROVIDERS,
} from '../constants/store.constants';

import { BundleEntity } from './bundle.entity';
import { OrderItemEntity } from './order-item.entity';
import { SubscriptionEntity } from './subscription.entity';

import type {
  BillingPeriod,
  Currency,
  OrderKind,
  OrderSelection,
  OrderStatus,
  PaymentProvider,
} from '../types/store.types';
import type { Relation } from 'typeorm';

@Entity('orders')
@Index('orders_status_expires_at_idx', ['status', 'expiresAt'])
@Check(
  'orders_bundle_selection_check',
  `("selection" = '${ORDER_SELECTIONS.BUNDLE}') = ("bundle_id" IS NOT NULL)`,
)
@Check(
  'orders_subscription_kind_check',
  `("kind" = '${ORDER_KINDS.PURCHASE}') = ("subscription_id" IS NULL)`,
)
@Check('orders_total_amount_minor_check', '"total_amount_minor" >= 0')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('orders_user_id_idx')
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<UserEntity>;

  @Column({
    type: 'enum',
    enum: Object.values(ORDER_KINDS),
    enumName: 'order_kind',
  })
  kind: OrderKind;

  @Column({
    type: 'enum',
    enum: Object.values(ORDER_SELECTIONS),
    enumName: 'order_selection',
  })
  selection: OrderSelection;

  @Column({ name: 'bundle_id', type: 'uuid', nullable: true })
  bundleId: string | null;

  @ManyToOne(() => BundleEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bundle_id' })
  bundle?: Relation<BundleEntity> | null;

  @Index('orders_subscription_id_idx')
  @Column({ name: 'subscription_id', type: 'uuid', nullable: true })
  subscriptionId: string | null;

  @ManyToOne(() => SubscriptionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Relation<SubscriptionEntity> | null;

  @Column({
    name: 'billing_period',
    type: 'enum',
    enum: Object.values(BILLING_PERIODS),
    enumName: 'order_billing_period',
  })
  billingPeriod: BillingPeriod;

  @Column({
    type: 'enum',
    enum: Object.values(ORDER_STATUSES),
    enumName: 'order_status',
    default: ORDER_STATUSES.PENDING,
  })
  status: OrderStatus;

  @Column({ name: 'total_amount_minor', type: 'integer' })
  totalAmountMinor: number;

  @Column({ type: 'char', length: 3 })
  currency: Currency;

  @Column({
    name: 'payment_provider',
    type: 'enum',
    enum: Object.values(PAYMENT_PROVIDERS),
    enumName: 'payment_provider',
  })
  paymentProvider: PaymentProvider;

  @Column({
    name: 'payment_reference',
    type: 'text',
    unique: true,
    nullable: true,
  })
  paymentReference: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items?: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

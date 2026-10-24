import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { ApplicationEntity } from './application.entity';
import { OrderEntity } from './order.entity';

import type { Relation } from 'typeorm';

@Entity('order_items')
@Unique('order_items_order_application_key', ['orderId', 'applicationId'])
@Check(
  'order_items_unit_amount_minor_check',
  '"unit_amount_minor" IS NULL OR "unit_amount_minor" >= 0',
)
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order?: Relation<OrderEntity>;

  @Index('order_items_application_id_idx')
  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => ApplicationEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'application_id' })
  application?: Relation<ApplicationEntity>;

  @Column({ name: 'unit_amount_minor', type: 'integer', nullable: true })
  unitAmountMinor: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

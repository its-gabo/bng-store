import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  OUTBOX_MESSAGE_STATUS,
  OUTBOX_MESSAGE_TYPE,
} from '../constants/outbox.constants';

import type {
  OutboxMessagePayload,
  OutboxMessageStatus,
} from '../types/outbox.types';

@Entity('outbox_messages')
@Index('outbox_messages_claim_idx', ['status', 'availableAt', 'createdAt'])
@Index('outbox_messages_locked_at_idx', ['status', 'lockedAt'])
export class OutboxMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', default: OUTBOX_MESSAGE_TYPE.EMAIL })
  type: string;

  @Column({ type: 'jsonb' })
  payload: OutboxMessagePayload;

  @Column({
    type: 'enum',
    enum: Object.values(OUTBOX_MESSAGE_STATUS),
    enumName: 'outbox_message_status',
    default: OUTBOX_MESSAGE_STATUS.PENDING,
  })
  status: OutboxMessageStatus;

  @Column({ type: 'integer', default: 0 })
  attempts: number;

  @Column({
    name: 'available_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  availableAt: Date;

  @Column({ name: 'locked_at', type: 'timestamptz', nullable: true })
  lockedAt: Date | null;

  @Column({ name: 'locked_by', type: 'text', nullable: true })
  lockedBy: string | null;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError: string | null;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

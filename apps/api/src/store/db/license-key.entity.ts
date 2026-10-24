import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SubscriptionEntity } from './subscription.entity';

import type { Relation } from 'typeorm';

@Entity('license_keys')
export class LicenseKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscription_id', type: 'uuid', unique: true })
  subscriptionId: string;

  @OneToOne(
    () => SubscriptionEntity,
    (subscription) => subscription.licenseKey,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Relation<SubscriptionEntity>;

  @Column({ name: 'key_hash', type: 'text', unique: true })
  keyHash: string;

  @Column({ name: 'key_hint', type: 'text' })
  keyHint: string;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

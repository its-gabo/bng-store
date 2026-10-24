import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { ApplicationEntity } from './application.entity';
import { SubscriptionEntity } from './subscription.entity';

import type { Relation } from 'typeorm';

@Entity('subscription_applications')
export class SubscriptionApplicationEntity {
  @PrimaryColumn({ name: 'subscription_id', type: 'uuid' })
  subscriptionId: string;

  @Index('subscription_applications_application_id_idx')
  @PrimaryColumn({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @ManyToOne(
    () => SubscriptionEntity,
    (subscription) => subscription.subscriptionApplications,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Relation<SubscriptionEntity>;

  @ManyToOne(() => ApplicationEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'application_id' })
  application?: Relation<ApplicationEntity>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

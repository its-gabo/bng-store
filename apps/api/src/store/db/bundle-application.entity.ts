import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ApplicationEntity } from './application.entity';
import { BundleEntity } from './bundle.entity';

import type { Relation } from 'typeorm';

@Entity('bundle_applications')
export class BundleApplicationEntity {
  @PrimaryColumn({ name: 'bundle_id', type: 'uuid' })
  bundleId: string;

  @Index('bundle_applications_application_id_idx')
  @PrimaryColumn({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => BundleEntity, (bundle) => bundle.bundleApplications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bundle_id' })
  bundle?: Relation<BundleEntity>;

  @ManyToOne(() => ApplicationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application?: Relation<ApplicationEntity>;
}

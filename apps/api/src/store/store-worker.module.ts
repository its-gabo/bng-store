import { Module } from '@nestjs/common';

import { StoreMaintenanceScheduler } from './schedulers/store-maintenance.scheduler';
import { StoreModule } from './store.module';

@Module({
  imports: [StoreModule],
  providers: [StoreMaintenanceScheduler],
})
export class StoreWorkerModule {}

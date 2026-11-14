import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { OutboxWorkerModule } from './outbox/outbox-worker.module';
import { StoreWorkerModule } from './store/store-worker.module';

@Module({
  imports: [ScheduleModule.forRoot(), OutboxWorkerModule, StoreWorkerModule],
})
export class WorkerModule {}

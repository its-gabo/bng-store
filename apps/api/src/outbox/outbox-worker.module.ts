import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from '../config/db/database';
import emailConfig from '../config/email/email';
import queueConfig from '../config/queue/queue';
import { DbModule } from '../db/db.module';
import { EmailModule } from '../email/email.module';
import { QueueModule } from '../queue/queue.module';

import { OutboxModule } from './outbox.module';
import { OutboxEmailConsumer } from './services/outbox-email.consumer';
import { OutboxWorkerService } from './services/outbox-worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      load: [databaseConfig, emailConfig, queueConfig],
    }),
    DbModule,
    QueueModule,
    EmailModule,
    OutboxModule,
  ],
  providers: [OutboxWorkerService, OutboxEmailConsumer],
})
export class OutboxWorkerModule {}

import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';

import { OutboxWorkerModule } from './outbox/outbox-worker.module';

config({
  path: ['.env', '../../.env'],
  quiet: true,
});

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(OutboxWorkerModule);

  app.enableShutdownHooks();
}

void bootstrap();

import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';

import { WorkerModule } from './worker.module';

config({
  path: ['.env', '../../.env'],
  quiet: true,
});

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);

  app.enableShutdownHooks();
}

void bootstrap();

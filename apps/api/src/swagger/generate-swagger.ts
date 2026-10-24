import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { registerValidationFormats } from '../common/http/validation';

import { exportSchemaToFile } from './export-schema-to-file';
import { API_GLOBAL_PREFIX, createSwaggerDocument } from './swagger.config';

registerValidationFormats();

async function generateSwagger() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    preview: true,
  });

  app.setGlobalPrefix(API_GLOBAL_PREFIX);

  const document = createSwaggerDocument(app);
  exportSchemaToFile(document);

  await app.close();
}

void generateSwagger();

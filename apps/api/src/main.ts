import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';
import { registerValidationFormats } from './common/http/validation';
import { exportSchemaToFile } from './swagger/export-schema-to-file';
import {
  API_GLOBAL_PREFIX,
  createSwaggerDocument,
} from './swagger/swagger.config';

config({
  path: ['.env', '../../.env'],
  quiet: true,
});

registerValidationFormats();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.setGlobalPrefix(API_GLOBAL_PREFIX);

  const document = createSwaggerDocument(app);
  exportSchemaToFile(document);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();

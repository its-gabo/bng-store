import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { attachSwaggerSchemas } from '../common/http/validation';

import type { INestApplication } from '@nestjs/common';

export const API_GLOBAL_PREFIX = 'api/v1';

export const createSwaggerDocument = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BNG Store API')
    .setDescription('BNG Store backend API documentation')
    .setVersion('1.0.0')
    .build();

  return attachSwaggerSchemas(SwaggerModule.createDocument(app, swaggerConfig));
};

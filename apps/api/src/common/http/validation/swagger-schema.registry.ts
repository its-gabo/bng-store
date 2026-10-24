import { SWAGGER_SCHEMA_REF_PREFIX } from './validation.constants';

import type { OpenAPIObject } from '@nestjs/swagger';
import type { TSchema } from '@sinclair/typebox';

const registeredSchemas = new Map<string, TSchema>();

export const registerSwaggerSchema = (name: string, schema: TSchema) => {
  const existing = registeredSchemas.get(name);

  if (existing && existing !== schema) {
    throw new Error(`[SWAGGER] Duplicate schema name "${name}"`);
  }

  registeredSchemas.set(name, schema);

  return { $ref: `${SWAGGER_SCHEMA_REF_PREFIX}${name}` };
};

export const attachSwaggerSchemas = (
  document: OpenAPIObject,
): OpenAPIObject => {
  document.components = {
    ...document.components,
    schemas: {
      ...document.components?.schemas,
      ...(Object.fromEntries(registeredSchemas) as NonNullable<
        OpenAPIObject['components']
      >['schemas']),
    },
  };

  return document;
};

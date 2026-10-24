import { SetMetadata, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Type, TypeGuard } from '@sinclair/typebox';

import { RequestValidationPipe } from './request-validation.pipe';
import { ResponseValidationInterceptor } from './response-validation.interceptor';
import { buildSchemaValidator } from './schema-validator';
import { registerSwaggerSchema } from './swagger-schema.registry';
import { RESPONSE_VALIDATOR_METADATA } from './validation.constants';

import type { SchemaValidator, ValidateConfig } from './validation.types';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function Validate(config: ValidateConfig): MethodDecorator {
  return (target, key, descriptor) => {
    const methodName = capitalize(String(key));
    const decorators: MethodDecorator[] = [];

    let bodyValidator: SchemaValidator | null = null;
    const queryValidators = new Map<string, SchemaValidator>();
    const paramValidators = new Map<string, SchemaValidator>();

    for (const requestConfig of config.request ?? []) {
      if (requestConfig.type === 'body') {
        const {
          schema,
          name = `${methodName}Body`,
          required = true,
          stripUnknownProps = false,
        } = requestConfig;

        bodyValidator = buildSchemaValidator({
          type: 'body',
          name,
          schema,
          required,
          stripUnknownProps,
        });

        decorators.push(
          ApiBody({ schema: registerSwaggerSchema(name, schema), required }),
        );
        continue;
      }

      const {
        type,
        name,
        schema = Type.String(),
        required = type === 'param',
        coerceTypes = true,
      } = requestConfig;
      const validator = buildSchemaValidator({
        type,
        name,
        schema,
        required,
        coerceTypes,
      });

      if (type === 'query') {
        queryValidators.set(name, validator);
        decorators.push(ApiQuery({ name, schema, required }));
      } else {
        paramValidators.set(name, validator);
        decorators.push(ApiParam({ name, schema, required }));
      }
    }

    if (config.request?.length) {
      decorators.push(
        UsePipes(
          ...config.request.flatMap(
            (requestConfig) => requestConfig.pipes ?? [],
          ),
          new RequestValidationPipe(
            bodyValidator,
            queryValidators,
            paramValidators,
          ),
        ),
      );
    }

    if (config.response) {
      const responseConfig = TypeGuard.IsSchema(config.response)
        ? { schema: config.response }
        : config.response;
      const {
        schema,
        name = `${methodName}Response`,
        responseCode = 200,
        description,
        stripUnknownProps = true,
      } = responseConfig;

      const validator = buildSchemaValidator({
        type: 'response',
        name,
        schema,
        required: true,
        stripUnknownProps,
      });

      decorators.push(
        SetMetadata(RESPONSE_VALIDATOR_METADATA, validator),
        UseInterceptors(ResponseValidationInterceptor),
        ApiResponse({
          status: responseCode,
          description,
          schema: registerSwaggerSchema(name, schema),
        }),
      );
    }

    for (const decorator of decorators) {
      decorator(target, key, descriptor);
    }

    return descriptor;
  };
}

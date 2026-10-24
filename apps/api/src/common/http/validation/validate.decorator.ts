import {
  applyDecorators,
  HttpStatus,
  SetMetadata,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiDefaultResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Type, TypeGuard } from '@sinclair/typebox';
import { match } from 'ts-pattern';

import { capitalize } from '../../utils/string.utils';
import { apiErrorResponseSchema } from '../response/response.schemas';

import { RequestValidationPipe } from './request-validation.pipe';
import { ResponseValidationInterceptor } from './response-validation.interceptor';
import { buildSchemaValidator } from './schema-validator';
import { registerSwaggerSchema } from './swagger-schema.registry';
import {
  API_ERROR_RESPONSE_SCHEMA_NAME,
  RESPONSE_VALIDATOR_METADATA,
  VALIDATION_TARGETS,
} from './validation.constants';

import type {
  BodyValidatorConfig,
  ParamValidatorConfig,
  RequestValidationTarget,
  RequestValidator,
  RequestValidatorConfig,
  ResponseValidatorConfig,
  ValidateConfig,
} from './validation.types';
import type { TSchema } from '@sinclair/typebox';

/**
 * Validates the request (body, query and path params) and the response of a
 * route against TypeBox schemas, and documents them in Swagger together with
 * the unified error response.
 */
export function Validate(config: ValidateConfig): MethodDecorator {
  return (target, key, descriptor) => {
    const methodName = capitalize(String(key));

    applyDecorators(
      ...buildRequestValidationDecorators(config.request ?? [], methodName),
      ...buildResponseValidationDecorators(config.response, methodName),
      documentErrorResponse(),
    )(target, key, descriptor);

    return descriptor;
  };
}

function buildRequestValidationDecorators(
  requestConfigs: RequestValidatorConfig[],
  methodName: string,
): MethodDecorator[] {
  if (requestConfigs.length === 0) return [];

  const requestValidators = requestConfigs.map((requestConfig) =>
    buildRequestValidator(requestConfig, methodName),
  );
  const customPipes = requestConfigs.flatMap(({ pipes = [] }) => pipes);

  return [
    ...requestValidators.map(({ swaggerDecorator }) => swaggerDecorator),
    UsePipes(...customPipes, createRequestValidationPipe(requestValidators)),
  ];
}

function buildRequestValidator(
  requestConfig: RequestValidatorConfig,
  methodName: string,
): RequestValidator {
  return match(requestConfig)
    .with({ type: VALIDATION_TARGETS.BODY }, (bodyConfig) =>
      buildBodyValidator(bodyConfig, methodName),
    )
    .with({ type: VALIDATION_TARGETS.QUERY }, (queryConfig) =>
      buildParameterValidator(queryConfig),
    )
    .with({ type: VALIDATION_TARGETS.PARAM }, (paramConfig) =>
      buildParameterValidator(paramConfig),
    )
    .exhaustive();
}

function buildBodyValidator(
  bodyConfig: BodyValidatorConfig,
  methodName: string,
): RequestValidator {
  const {
    schema,
    name = `${methodName}Body`,
    required = true,
    stripUnknownProps = false,
  } = bodyConfig;

  return {
    target: VALIDATION_TARGETS.BODY,
    validator: buildSchemaValidator({
      type: VALIDATION_TARGETS.BODY,
      name,
      schema,
      required,
      stripUnknownProps,
    }),
    swaggerDecorator: ApiBody({
      schema: registerSwaggerSchema(name, schema),
      required,
    }),
  };
}

function buildParameterValidator(
  parameterConfig: ParamValidatorConfig,
): RequestValidator {
  const {
    type,
    name,
    schema = Type.String(),
    required = type === VALIDATION_TARGETS.PARAM,
    coerceTypes = true,
  } = parameterConfig;

  return {
    target: type,
    validator: buildSchemaValidator({
      type,
      name,
      schema,
      required,
      coerceTypes,
    }),
    swaggerDecorator: match(type)
      .with(VALIDATION_TARGETS.QUERY, () =>
        ApiQuery({ name, schema, required }),
      )
      .with(VALIDATION_TARGETS.PARAM, () =>
        ApiParam({ name, schema, required }),
      )
      .exhaustive(),
  };
}

function createRequestValidationPipe(
  requestValidators: RequestValidator[],
): RequestValidationPipe {
  const findValidators = (target: RequestValidationTarget) =>
    requestValidators
      .filter((requestValidator) => requestValidator.target === target)
      .map(({ validator }) => validator);

  const [bodyValidator = null] = findValidators(VALIDATION_TARGETS.BODY);
  const validatorsByName = (target: RequestValidationTarget) =>
    new Map(
      findValidators(target).map((validator) => [validator.name, validator]),
    );

  return new RequestValidationPipe(
    bodyValidator,
    validatorsByName(VALIDATION_TARGETS.QUERY),
    validatorsByName(VALIDATION_TARGETS.PARAM),
  );
}

function buildResponseValidationDecorators(
  response: ValidateConfig['response'],
  methodName: string,
): MethodDecorator[] {
  if (!response) return [];

  const {
    schema,
    name = `${methodName}Response`,
    responseCode = HttpStatus.OK,
    description,
    stripUnknownProps = true,
  } = toResponseValidatorConfig(response);

  const responseValidator = buildSchemaValidator({
    type: VALIDATION_TARGETS.RESPONSE,
    name,
    schema,
    required: true,
    stripUnknownProps,
  });

  return [
    SetMetadata(RESPONSE_VALIDATOR_METADATA, responseValidator),
    UseInterceptors(ResponseValidationInterceptor),
    ApiResponse({
      status: responseCode,
      description,
      schema: registerSwaggerSchema(name, schema),
    }),
  ];
}

function toResponseValidatorConfig(
  response: TSchema | ResponseValidatorConfig,
): ResponseValidatorConfig {
  if (TypeGuard.IsSchema(response)) return { schema: response };

  return response;
}

function documentErrorResponse(): MethodDecorator {
  return ApiDefaultResponse({
    description: 'Unified error response',
    schema: registerSwaggerSchema(
      API_ERROR_RESPONSE_SCHEMA_NAME,
      apiErrorResponseSchema,
    ),
  });
}

import type { VALIDATION_TARGETS } from './validation.constants';
import type { PipeTransform } from '@nestjs/common';
import type { TSchema } from '@sinclair/typebox';

export type ValidationTarget =
  (typeof VALIDATION_TARGETS)[keyof typeof VALIDATION_TARGETS];

export type RequestValidationTarget = Exclude<
  ValidationTarget,
  typeof VALIDATION_TARGETS.RESPONSE
>;

export type SchemaValidator = {
  name: string;
  schema: TSchema;
  validate: (data: unknown) => unknown;
};

export type BuildSchemaValidatorConfig = {
  type: ValidationTarget;
  name: string;
  schema: TSchema;
  required: boolean;
  coerceTypes?: boolean;
  stripUnknownProps?: boolean;
};

export type BodyValidatorConfig = {
  type: typeof VALIDATION_TARGETS.BODY;
  schema: TSchema;
  name?: string;
  required?: boolean;
  stripUnknownProps?: boolean;
  pipes?: PipeTransform[];
};

export type ParamValidatorConfig = {
  type: typeof VALIDATION_TARGETS.PARAM | typeof VALIDATION_TARGETS.QUERY;
  name: string;
  schema?: TSchema;
  required?: boolean;
  coerceTypes?: boolean;
  pipes?: PipeTransform[];
};

export type RequestValidatorConfig = BodyValidatorConfig | ParamValidatorConfig;

export type ResponseValidatorConfig = {
  schema: TSchema;
  name?: string;
  responseCode?: number;
  description?: string;
  stripUnknownProps?: boolean;
};

export type ValidateConfig = {
  request?: RequestValidatorConfig[];
  response?: TSchema | ResponseValidatorConfig;
};

export type RequestValidator = {
  target: RequestValidationTarget;
  validator: SchemaValidator;
  swaggerDecorator: MethodDecorator;
};

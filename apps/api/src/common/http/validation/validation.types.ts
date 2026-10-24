import type { PipeTransform } from '@nestjs/common';
import type { TSchema } from '@sinclair/typebox';

export type ValidationTarget = 'body' | 'query' | 'param' | 'response';

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
  type: 'body';
  schema: TSchema;
  name?: string;
  required?: boolean;
  stripUnknownProps?: boolean;
  pipes?: PipeTransform[];
};

export type ParamValidatorConfig = {
  type: 'param' | 'query';
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

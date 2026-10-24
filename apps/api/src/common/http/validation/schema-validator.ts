import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Value } from '@sinclair/typebox/value';

import { ValidationException } from './validation.exception';

import type {
  BuildSchemaValidatorConfig,
  SchemaValidator,
} from './validation.types';

export const buildSchemaValidator = (
  config: BuildSchemaValidatorConfig,
): SchemaValidator => {
  const { type, name, schema, required, coerceTypes, stripUnknownProps } =
    config;
  const checker = TypeCompiler.Compile(schema);

  return {
    name,
    schema,
    validate(data) {
      if (data === undefined && !required) return data;

      let value = Value.Default(schema, data);

      if (stripUnknownProps) value = Value.Clean(schema, value);
      if (coerceTypes) value = Value.Convert(schema, value);

      if (!checker.Check(value)) {
        throw new ValidationException(type, checker.Errors(value));
      }

      return value;
    },
  };
};

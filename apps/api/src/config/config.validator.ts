import { TypeCompiler } from '@sinclair/typebox/compiler';

import type { Static, TObject } from '@sinclair/typebox';

export function configValidator<T extends TObject>(schema: T) {
  const validator = TypeCompiler.Compile(schema);

  return function validateConfig(values: Record<string, unknown>): Static<T> {
    if (validator.Check(values)) return values;

    const errors = [...validator.Errors(values)];

    console.error('[CONFIG] Invalid configuration:', errors);
    throw new Error('[CONFIG] Invalid configuration');
  };
}

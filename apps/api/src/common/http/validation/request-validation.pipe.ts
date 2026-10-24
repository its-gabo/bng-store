import type { SchemaValidator } from './validation.types';
import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class RequestValidationPipe implements PipeTransform {
  constructor(
    private readonly bodyValidator: SchemaValidator | null,
    private readonly queryValidators: Map<string, SchemaValidator>,
    private readonly paramValidators: Map<string, SchemaValidator>,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const { type, data } = metadata;

    if (type === 'body' && this.bodyValidator) {
      return this.bodyValidator.validate(value);
    }

    if (type === 'query' && data) {
      return this.queryValidators.get(data)?.validate(value) ?? value;
    }

    if (type === 'param' && data) {
      return this.paramValidators.get(data)?.validate(value) ?? value;
    }

    return value;
  }
}

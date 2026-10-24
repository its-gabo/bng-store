import { HttpStatus } from '@nestjs/common';

import { ApiException } from '../response/response.exception';

import type { ValidationTarget } from './validation.types';
import type { ValueError } from '@sinclair/typebox/errors';

export class ValidationException extends ApiException {
  constructor(target: ValidationTarget, errors: Iterable<ValueError>) {
    super(HttpStatus.BAD_REQUEST, {
      code: 'validation.fail',
      message: `Validation failed (${target})`,
      reason: 'validation.invalid_request',
      errors: [...errors].map(({ path, message }) => ({ path, message })),
    });
  }
}

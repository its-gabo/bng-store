import { HttpException } from '@nestjs/common';

import type { ApiErrorResponse } from './response.types';
import type { HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(status: HttpStatus, payload: ApiErrorResponse) {
    super(payload, status);
  }
}

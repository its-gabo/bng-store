import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';

import { RESPONSE_VALIDATOR_METADATA } from './validation.constants';

import type { SchemaValidator } from './validation.types';
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';

@Injectable()
export class ResponseValidationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const validator = this.reflector.get<SchemaValidator | undefined>(
      RESPONSE_VALIDATOR_METADATA,
      context.getHandler(),
    );

    return next
      .handle()
      .pipe(map((data: unknown) => validator?.validate(data) ?? data));
  }
}

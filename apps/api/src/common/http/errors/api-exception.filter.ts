import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { match, P } from 'ts-pattern';

import { DomainError } from '../../errors/domain-error';
import { getErrorStack } from '../../utils/error.utils';
import { ApiException } from '../response/response.exception';

import { mapDomainErrorKindToHttpStatus } from './domain-error-http-status';
import { HTTP_ERROR_RESPONSES } from './http-error.constants';

import type { ApiErrorResponse } from '../response/response.types';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

type HttpErrorReply = {
  status: HttpStatus;
  body: ApiErrorResponse;
};

/**
 * Turns every error thrown while handling a request into the unified
 * `ApiErrorResponse` shape. Unexpected errors are logged and hidden behind
 * a generic 500 so internals never reach the client.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, body } = this.toHttpErrorReply(exception);

    response.status(status).json(body);
  }

  private toHttpErrorReply(exception: unknown): HttpErrorReply {
    return match(exception)
      .with(P.instanceOf(DomainError), ({ definition }) => {
        const { code, message, reason } = definition;

        return {
          status: mapDomainErrorKindToHttpStatus(definition.kind),
          body: { code, message, reason },
        };
      })
      .with(P.instanceOf(ApiException), (apiException) => ({
        status: apiException.getStatus(),
        body: apiException.getResponse() as ApiErrorResponse,
      }))
      .with(P.instanceOf(HttpException), (httpException) => ({
        status: httpException.getStatus(),
        body: {
          ...HTTP_ERROR_RESPONSES.REQUEST_FAILED,
          message: httpException.message,
        },
      }))
      .otherwise((error) => {
        this.logger.error(
          'Unhandled error while processing request',
          getErrorStack(error),
        );

        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: HTTP_ERROR_RESPONSES.INTERNAL_ERROR,
        };
      });
  }
}

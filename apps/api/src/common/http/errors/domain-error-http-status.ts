import { HttpStatus } from '@nestjs/common';
import { match } from 'ts-pattern';

import { DOMAIN_ERROR_KINDS } from '../../errors/domain-error.constants';

import type { DomainErrorKind } from '../../errors/domain-error.types';

export const mapDomainErrorKindToHttpStatus = (
  kind: DomainErrorKind,
): HttpStatus =>
  match(kind)
    .with(DOMAIN_ERROR_KINDS.NOT_FOUND, () => HttpStatus.NOT_FOUND)
    .with(DOMAIN_ERROR_KINDS.CONFLICT, () => HttpStatus.CONFLICT)
    .with(DOMAIN_ERROR_KINDS.GONE, () => HttpStatus.GONE)
    .with(DOMAIN_ERROR_KINDS.UNAUTHENTICATED, () => HttpStatus.UNAUTHORIZED)
    .with(DOMAIN_ERROR_KINDS.FORBIDDEN, () => HttpStatus.FORBIDDEN)
    .with(
      DOMAIN_ERROR_KINDS.INVALID_INPUT,
      () => HttpStatus.UNPROCESSABLE_ENTITY,
    )
    .exhaustive();

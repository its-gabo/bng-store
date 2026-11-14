import { match } from 'ts-pattern';

import { DomainError } from '../../common/errors/domain-error';
import { ORDER_REJECTION_REASONS } from '../constants/store.constants';

import { STORE_ERRORS } from './store.errors';

import type { OrderRejectionReason } from '../types/store.types';

export const createOrderRejectedError = (
  rejectionReason: OrderRejectionReason,
): DomainError =>
  match(rejectionReason)
    .with(
      ORDER_REJECTION_REASONS.APPLICATIONS_ALREADY_OWNED,
      () =>
        new DomainError(STORE_ERRORS.ORDER_REJECTED_APPLICATIONS_ALREADY_OWNED),
    )
    .with(
      ORDER_REJECTION_REASONS.SUBSCRIPTION_NOT_ADJUSTABLE,
      () =>
        new DomainError(
          STORE_ERRORS.ORDER_REJECTED_SUBSCRIPTION_NOT_ADJUSTABLE,
        ),
    )
    .exhaustive();

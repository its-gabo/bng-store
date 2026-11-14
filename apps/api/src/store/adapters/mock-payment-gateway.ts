import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  PAYMENT_PROVIDERS,
  PAYMENT_STATUSES,
} from '../constants/store.constants';
import { PaymentGateway } from '../ports/payment-gateway';

import type { CreatedPayment, PaymentCharge } from '../types/store.types';

/**
 * Creates payments that are confirmed through the mock confirmation endpoint
 * and charges renewals successfully without contacting any provider.
 */
@Injectable()
export class MockPaymentGateway extends PaymentGateway {
  createPayment(): Promise<CreatedPayment> {
    return Promise.resolve(this.createMockPayment());
  }

  chargeSavedPaymentMethod(): Promise<PaymentCharge> {
    return Promise.resolve({
      ...this.createMockPayment(),
      paymentStatus: PAYMENT_STATUSES.SUCCEEDED,
    });
  }

  private createMockPayment(): CreatedPayment {
    return {
      paymentProvider: PAYMENT_PROVIDERS.MOCK,
      paymentReference: `mock_${randomUUID()}`,
    };
  }
}

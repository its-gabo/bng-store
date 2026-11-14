import type {
  CreatedPayment,
  PaymentCharge,
  PaymentRequest,
} from '../types/store.types';

/**
 * Port to the payment provider. Bound to `MockPaymentGateway` until a real
 * provider is integrated.
 */
export abstract class PaymentGateway {
  abstract createPayment(request: PaymentRequest): Promise<CreatedPayment>;

  abstract chargeSavedPaymentMethod(
    request: PaymentRequest,
  ): Promise<PaymentCharge>;
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import storeConfig from '../config/store/store';

import { MockLicenseKeyIssuer } from './adapters/mock-license-key-issuer';
import { MockPaymentGateway } from './adapters/mock-payment-gateway';
import { LicenseKeyIssuer } from './ports/license-key-issuer';
import { PaymentGateway } from './ports/payment-gateway';
import { StoreCatalogRepository } from './repository/store-catalog.repository';
import { StoreOrdersRepository } from './repository/store-orders.repository';
import { StoreSubscriptionsRepository } from './repository/store-subscriptions.repository';
import { StoreCatalogService } from './services/store-catalog.service';
import { StoreCheckoutService } from './services/store-checkout.service';
import { StoreOrderFulfillmentService } from './services/store-order-fulfillment.service';
import { StoreOwnershipService } from './services/store-ownership.service';
import { StoreSubscriptionRenewalService } from './services/store-subscription-renewal.service';
import { StoreSubscriptionsService } from './services/store-subscriptions.service';

@Module({
  imports: [ConfigModule.forFeature(storeConfig)],
  providers: [
    StoreCatalogRepository,
    StoreOrdersRepository,
    StoreSubscriptionsRepository,
    { provide: PaymentGateway, useClass: MockPaymentGateway },
    { provide: LicenseKeyIssuer, useClass: MockLicenseKeyIssuer },
    StoreCatalogService,
    StoreOwnershipService,
    StoreCheckoutService,
    StoreOrderFulfillmentService,
    StoreSubscriptionsService,
    StoreSubscriptionRenewalService,
  ],
  exports: [
    StoreCatalogService,
    StoreCheckoutService,
    StoreOrderFulfillmentService,
    StoreSubscriptionsService,
    StoreSubscriptionRenewalService,
  ],
})
export class StoreModule {}

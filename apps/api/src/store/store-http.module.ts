import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { LicenseKeyValidationController } from './controllers/license-key-validation.controller';
import { MyLicenseKeyController } from './controllers/my-license-key.controller';
import { MySubscriptionsController } from './controllers/my-subscriptions.controller';
import { StoreCatalogController } from './controllers/store-catalog.controller';
import { StoreCheckoutController } from './controllers/store-checkout.controller';
import { StoreModule } from './store.module';

@Module({
  imports: [AuthModule, StoreModule],
  controllers: [
    StoreCatalogController,
    StoreCheckoutController,
    MySubscriptionsController,
    MyLicenseKeyController,
    LicenseKeyValidationController,
  ],
})
export class StoreHttpModule {}

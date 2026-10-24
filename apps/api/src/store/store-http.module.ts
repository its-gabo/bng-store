import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

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
  ],
})
export class StoreHttpModule {}

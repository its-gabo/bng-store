import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import {
  toStoreConfirmedOrderDto,
  toStorePendingOrderDto,
  toStoreSelectionRequest,
} from '../dto/store.dto.mappers';
import { STORE_SUCCESS_RESULTS } from '../dto/store.responses';
import {
  storeConfirmedOrderSuccessResponseSchema,
  storePaymentReferenceParamSchema,
  storePendingOrderSuccessResponseSchema,
  storeSelectionBodySchema,
} from '../dto/store.schemas';
import { StoreCheckoutService } from '../services/store-checkout.service';
import { StoreOrderFulfillmentService } from '../services/store-order-fulfillment.service';

import type { AuthUserSession } from '../../auth/types/auth.types';
import type {
  StoreConfirmedOrderSuccessResponse,
  StorePendingOrderSuccessResponse,
  StoreSelectionBody,
} from '../dto/store.dto.types';

@Controller('store')
@UseGuards(SessionAuthGuard)
export class StoreCheckoutController {
  constructor(
    private readonly storeCheckoutService: StoreCheckoutService,
    private readonly storeOrderFulfillmentService: StoreOrderFulfillmentService,
  ) {}

  @Post('checkout')
  @Validate({
    request: [
      {
        type: 'body',
        name: 'StoreSelectionBody',
        schema: storeSelectionBodySchema,
      },
    ],
    response: storePendingOrderSuccessResponseSchema,
  })
  async checkoutSelection(
    @CurrentUser() session: AuthUserSession,
    @Body() body: StoreSelectionBody,
  ): Promise<StorePendingOrderSuccessResponse> {
    const pendingOrder = await this.storeCheckoutService.checkoutSelection(
      session.userId,
      toStoreSelectionRequest(body),
    );

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.CHECKOUT,
      toStorePendingOrderDto(pendingOrder),
    );
  }

  @Post('payments/mock/:paymentReference/confirm')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'paymentReference',
        schema: storePaymentReferenceParamSchema,
      },
    ],
    response: storeConfirmedOrderSuccessResponseSchema,
  })
  async confirmMockPayment(
    @CurrentUser() session: AuthUserSession,
    @Param('paymentReference') paymentReference: string,
  ): Promise<StoreConfirmedOrderSuccessResponse> {
    const confirmedOrder =
      await this.storeOrderFulfillmentService.confirmMockPayment(
        session.userId,
        paymentReference,
      );

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.PAYMENT,
      toStoreConfirmedOrderDto(confirmedOrder),
    );
  }
}

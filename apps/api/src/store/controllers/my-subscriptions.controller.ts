import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import {
  toStorePendingOrderDto,
  toStoreSelectionRequest,
  toStoreUserSubscriptionDto,
} from '../dto/store.dto.mappers';
import { STORE_SUCCESS_RESULTS } from '../dto/store.responses';
import {
  storeEmptySuccessResponseSchema,
  storePendingOrderSuccessResponseSchema,
  storeSelectionBodySchema,
  storeSubscriptionIdParamSchema,
  storeUserSubscriptionsSuccessResponseSchema,
} from '../dto/store.schemas';
import { StoreCheckoutService } from '../services/store-checkout.service';
import { StoreSubscriptionsService } from '../services/store-subscriptions.service';

import type { AuthUserSession } from '../../auth/types/auth.types';
import type {
  StoreEmptySuccessResponse,
  StorePendingOrderSuccessResponse,
  StoreSelectionBody,
  StoreUserSubscriptionsSuccessResponse,
} from '../dto/store.dto.types';

@Controller('me/subscriptions')
@UseGuards(SessionAuthGuard)
export class MySubscriptionsController {
  constructor(
    private readonly storeSubscriptionsService: StoreSubscriptionsService,
    private readonly storeCheckoutService: StoreCheckoutService,
  ) {}

  @Get()
  @Validate({ response: storeUserSubscriptionsSuccessResponseSchema })
  async listMySubscriptions(
    @CurrentUser() session: AuthUserSession,
  ): Promise<StoreUserSubscriptionsSuccessResponse> {
    const subscriptions =
      await this.storeSubscriptionsService.listUserSubscriptions(
        session.userId,
      );

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.SUBSCRIPTIONS,
      subscriptions.map(toStoreUserSubscriptionDto),
    );
  }

  @Post(':subscriptionId/cancel')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'subscriptionId',
        schema: storeSubscriptionIdParamSchema,
      },
    ],
    response: storeEmptySuccessResponseSchema,
  })
  async cancelMySubscription(
    @CurrentUser() session: AuthUserSession,
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<StoreEmptySuccessResponse> {
    await this.storeSubscriptionsService.cancelSubscriptionAtPeriodEnd(
      session.userId,
      subscriptionId,
    );

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.SUBSCRIPTION_CANCEL,
      {},
    );
  }

  @Post(':subscriptionId/adjustments')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'subscriptionId',
        schema: storeSubscriptionIdParamSchema,
      },
      {
        type: 'body',
        name: 'StoreSelectionBody',
        schema: storeSelectionBodySchema,
      },
    ],
    response: storePendingOrderSuccessResponseSchema,
  })
  async requestMySubscriptionAdjustment(
    @CurrentUser() session: AuthUserSession,
    @Param('subscriptionId') subscriptionId: string,
    @Body() body: StoreSelectionBody,
  ): Promise<StorePendingOrderSuccessResponse> {
    const pendingOrder =
      await this.storeCheckoutService.requestSubscriptionAdjustment(
        session.userId,
        subscriptionId,
        toStoreSelectionRequest(body),
      );

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.SUBSCRIPTION_ADJUST,
      toStorePendingOrderDto(pendingOrder),
    );
  }
}

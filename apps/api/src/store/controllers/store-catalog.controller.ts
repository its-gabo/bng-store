import { Body, Controller, Get, Post } from '@nestjs/common';

import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import { toStoreCatalogDto, toStoreQuoteDto } from '../dto/store.dto.mappers';
import { STORE_SUCCESS_RESULTS } from '../dto/store.responses';
import {
  storeCatalogSuccessResponseSchema,
  storeQuoteBodySchema,
  storeQuoteSuccessResponseSchema,
} from '../dto/store.schemas';
import { StoreCatalogService } from '../services/store-catalog.service';

import type {
  StoreCatalogSuccessResponse,
  StoreQuoteBody,
  StoreQuoteSuccessResponse,
} from '../dto/store.dto.types';

@Controller('store')
export class StoreCatalogController {
  constructor(private readonly storeCatalogService: StoreCatalogService) {}

  @Get('catalog')
  @Validate({ response: storeCatalogSuccessResponseSchema })
  async getCatalog(): Promise<StoreCatalogSuccessResponse> {
    const catalog = await this.storeCatalogService.getCatalog();

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.CATALOG,
      toStoreCatalogDto(catalog),
    );
  }

  @Post('quote')
  @Validate({
    request: [{ type: 'body', schema: storeQuoteBodySchema }],
    response: storeQuoteSuccessResponseSchema,
  })
  async quoteCustomSelection(
    @Body() body: StoreQuoteBody,
  ): Promise<StoreQuoteSuccessResponse> {
    const quote = await this.storeCatalogService.quoteCustomSelection(body);

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.QUOTE,
      toStoreQuoteDto(quote),
    );
  }
}

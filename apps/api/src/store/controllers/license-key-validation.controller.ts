import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { SensitiveRateLimit } from '../../common/http/rate-limit/sensitive-rate-limit.decorator';
import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import { toStoreLicenseKeyValidationDto } from '../dto/store.dto.mappers';
import { STORE_SUCCESS_RESULTS } from '../dto/store.responses';
import {
  storeLicenseKeyValidationBodySchema,
  storeLicenseKeyValidationSuccessResponseSchema,
} from '../dto/store.schemas';
import { StoreLicenseKeysService } from '../services/store-license-keys.service';

import type {
  StoreLicenseKeyValidationBody,
  StoreLicenseKeyValidationSuccessResponse,
} from '../dto/store.dto.types';

@Controller('store/license-keys')
export class LicenseKeyValidationController {
  constructor(
    private readonly storeLicenseKeysService: StoreLicenseKeysService,
  ) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @SensitiveRateLimit()
  @Validate({
    request: [{ type: 'body', schema: storeLicenseKeyValidationBodySchema }],
    response: storeLicenseKeyValidationSuccessResponseSchema,
  })
  async validateLicenseKey(
    @Body() body: StoreLicenseKeyValidationBody,
  ): Promise<StoreLicenseKeyValidationSuccessResponse> {
    const validation = await this.storeLicenseKeysService.validateLicenseKey(
      body.licenseKey,
    );

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.LICENSE_KEY_VALIDATION,
      toStoreLicenseKeyValidationDto(validation),
    );
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import { toStoreUserLicenseKeyDto } from '../dto/store.dto.mappers';
import { STORE_SUCCESS_RESULTS } from '../dto/store.responses';
import { storeUserLicenseKeySuccessResponseSchema } from '../dto/store.schemas';
import { StoreLicenseKeysService } from '../services/store-license-keys.service';

import type { AuthUserSession } from '../../auth/types/auth.types';
import type { StoreUserLicenseKeySuccessResponse } from '../dto/store.dto.types';

@Controller('me/license-key')
@UseGuards(SessionAuthGuard)
export class MyLicenseKeyController {
  constructor(
    private readonly storeLicenseKeysService: StoreLicenseKeysService,
  ) {}

  @Get()
  @Validate({ response: storeUserLicenseKeySuccessResponseSchema })
  async getMyLicenseKey(
    @CurrentUser() session: AuthUserSession,
  ): Promise<StoreUserLicenseKeySuccessResponse> {
    const licenseKey = await this.storeLicenseKeysService.findUserLicenseKey(
      session.userId,
    );

    return createApiSuccessResponse(
      STORE_SUCCESS_RESULTS.LICENSE_KEY,
      toStoreUserLicenseKeyDto(licenseKey),
    );
  }
}

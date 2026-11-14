import { Controller, Get, Query } from '@nestjs/common';

import { SensitiveRateLimit } from '../../common/http/rate-limit/sensitive-rate-limit.decorator';
import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import { AUTH_SUCCESS_RESULTS } from '../dto/auth.responses';
import {
  authEmptySuccessResponseSchema,
  authVerifyEmailQuerySchema,
} from '../dto/auth.schemas';
import { AuthEmailVerificationService } from '../services/auth-email-verification.service';

import type { AuthEmptySuccessResponse } from '../dto/auth.dto.types';

@Controller('auth')
export class AuthEmailVerificationController {
  constructor(
    private readonly authEmailVerificationService: AuthEmailVerificationService,
  ) {}

  @Get('verify-email')
  @SensitiveRateLimit()
  @Validate({
    request: [
      {
        type: 'query',
        name: 'token',
        required: true,
        schema: authVerifyEmailQuerySchema.properties.token,
      },
    ],
    response: authEmptySuccessResponseSchema,
  })
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<AuthEmptySuccessResponse> {
    await this.authEmailVerificationService.verifyEmail(token);

    return createApiSuccessResponse(AUTH_SUCCESS_RESULTS.VERIFY_EMAIL, {});
  }
}

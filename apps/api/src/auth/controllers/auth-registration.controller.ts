import { Body, Controller, Post } from '@nestjs/common';

import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import { AUTH_SUCCESS_RESULTS } from '../dto/auth.responses';
import {
  authEmptySuccessResponseSchema,
  authSignUpBodySchema,
} from '../dto/auth.schemas';
import { AuthRegistrationService } from '../services/auth-registration.service';

import type {
  AuthEmptySuccessResponse,
  AuthSignUpBody,
} from '../dto/auth.dto.types';

@Controller('auth')
export class AuthRegistrationController {
  constructor(
    private readonly authRegistrationService: AuthRegistrationService,
  ) {}

  @Post('sign-up/email')
  @Validate({
    request: [{ type: 'body', schema: authSignUpBodySchema }],
    response: authEmptySuccessResponseSchema,
  })
  async signUpEmail(
    @Body() body: AuthSignUpBody,
  ): Promise<AuthEmptySuccessResponse> {
    await this.authRegistrationService.signUpEmail(body);

    return createApiSuccessResponse(AUTH_SUCCESS_RESULTS.SIGN_UP, {});
  }
}

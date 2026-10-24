import { Body, Controller, Post } from '@nestjs/common';

import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import { AUTH_SUCCESS_RESULTS } from '../dto/auth.responses';
import {
  authEmptySuccessResponseSchema,
  authForgotPasswordBodySchema,
  authResetPasswordBodySchema,
} from '../dto/auth.schemas';
import { AuthPasswordResetService } from '../services/auth-password-reset.service';

import type {
  AuthEmptySuccessResponse,
  AuthForgotPasswordBody,
  AuthResetPasswordBody,
} from '../dto/auth.dto.types';

@Controller('auth')
export class AuthPasswordController {
  constructor(
    private readonly authPasswordResetService: AuthPasswordResetService,
  ) {}

  @Post('forgot-password')
  @Validate({
    request: [{ type: 'body', schema: authForgotPasswordBodySchema }],
    response: authEmptySuccessResponseSchema,
  })
  async forgotPassword(
    @Body() body: AuthForgotPasswordBody,
  ): Promise<AuthEmptySuccessResponse> {
    await this.authPasswordResetService.requestPasswordReset(body);

    return createApiSuccessResponse(AUTH_SUCCESS_RESULTS.FORGOT_PASSWORD, {});
  }

  @Post('reset-password')
  @Validate({
    request: [{ type: 'body', schema: authResetPasswordBodySchema }],
    response: authEmptySuccessResponseSchema,
  })
  async resetPassword(
    @Body() body: AuthResetPasswordBody,
  ): Promise<AuthEmptySuccessResponse> {
    await this.authPasswordResetService.resetPassword(body);

    return createApiSuccessResponse(AUTH_SUCCESS_RESULTS.RESET_PASSWORD, {});
  }
}

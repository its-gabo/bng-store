import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';

import { createApiSuccessResponse } from '../../common/http/response/response.factory';
import { Validate } from '../../common/http/validation';
import { toAuthSessionDto, toAuthUserDto } from '../dto/auth.dto.mappers';
import { AUTH_SUCCESS_RESULTS } from '../dto/auth.responses';
import {
  authEmptySuccessResponseSchema,
  authSessionSuccessResponseSchema,
  authSignInBodySchema,
  authSignInSuccessResponseSchema,
} from '../dto/auth.schemas';
import { AuthCookieService } from '../services/auth-cookie.service';
import { AuthSessionService } from '../services/auth-session.service';

import type {
  AuthEmptySuccessResponse,
  AuthSessionSuccessResponse,
  AuthSignInBody,
  AuthSignInSuccessResponse,
} from '../dto/auth.dto.types';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthSessionController {
  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Post('sign-in/email')
  @Validate({
    request: [{ type: 'body', schema: authSignInBodySchema }],
    response: authSignInSuccessResponseSchema,
  })
  async signInEmail(
    @Body() body: AuthSignInBody,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSignInSuccessResponse> {
    const { session, sessionToken } = await this.authSessionService.signInEmail(
      body,
      { ipAddress: request.ip, userAgent: request.headers['user-agent'] },
    );

    response.cookie(
      this.authCookieService.getSessionCookieName(),
      sessionToken,
      this.authCookieService.getSessionCookieOptions(session.expiresAt),
    );

    return createApiSuccessResponse(AUTH_SUCCESS_RESULTS.SIGN_IN, {
      user: toAuthUserDto(session),
    });
  }

  @Post('sign-out')
  @Validate({ response: authEmptySuccessResponseSchema })
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthEmptySuccessResponse> {
    const sessionToken = this.authCookieService.extractSessionToken(
      request.headers.cookie,
    );

    await this.authSessionService.signOut(sessionToken);

    response.clearCookie(
      this.authCookieService.getSessionCookieName(),
      this.authCookieService.getClearCookieOptions(),
    );

    return createApiSuccessResponse(AUTH_SUCCESS_RESULTS.SIGN_OUT, {});
  }

  @Get('session')
  @Validate({ response: authSessionSuccessResponseSchema })
  async getSession(
    @Req() request: Request,
  ): Promise<AuthSessionSuccessResponse> {
    const sessionToken = this.authCookieService.extractSessionToken(
      request.headers.cookie,
    );

    const session = await this.authSessionService.getSession(sessionToken);

    return createApiSuccessResponse(
      AUTH_SUCCESS_RESULTS.SESSION,
      toAuthSessionDto(session),
    );
  }
}

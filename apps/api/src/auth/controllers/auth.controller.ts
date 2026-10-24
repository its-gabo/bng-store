import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Validate } from '../../common/http/validation';

import {
  authEmptySuccessResponseSchema,
  authForgotPasswordBodySchema,
  authResetPasswordBodySchema,
  authSessionSuccessResponseSchema,
  authSignInSuccessResponseSchema,
  authSignInBodySchema,
  authSignUpBodySchema,
  authVerifyEmailQuerySchema,
} from '../dto/auth.schemas';
import { AuthCookieService } from '../services/auth-cookie.service';
import { AuthService } from '../services/auth.service';

import type {
  AuthForgotPasswordBody,
  AuthSignInBody,
  AuthSignUpBody,
  AuthEmptySuccessResponse,
  AuthResetPasswordBody,
  AuthSessionSuccessResponse,
  AuthSignInSuccessResponse,
} from '../dto/auth.dto.types';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Post('sign-up/email')
  @Validate({
    request: [{ type: 'body', schema: authSignUpBodySchema }],
    response: authEmptySuccessResponseSchema,
  })
  async signUpEmail(
    @Body() body: AuthSignUpBody,
  ): Promise<AuthEmptySuccessResponse> {
    await this.authService.signUpEmail(body);

    return {
      code: 'auth.sign_up.success',
      message: 'User created',
      data: {},
    };
  }

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
    const { ip, headers } = request;

    const { session, sessionToken } = await this.authService.signInEmail(body, {
      ipAddress: ip,
      userAgent: headers['user-agent'],
    });

    response.cookie(
      this.authCookieService.getSessionCookieName(),
      sessionToken,
      this.authCookieService.getSessionCookieOptions(session.expiresAt),
    );

    return {
      code: 'auth.sign_in.success',
      message: 'User signed in',
      data: {
        user: {
          id: session.userId,
          email: session.email,
          name: session.name,
          emailVerified: session.emailVerified,
        },
      },
    };
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

    await this.authService.signOut(sessionToken);

    response.clearCookie(
      this.authCookieService.getSessionCookieName(),
      this.authCookieService.getClearCookieOptions(),
    );

    return {
      code: 'auth.sign_out.success',
      message: 'User signed out',
      data: {},
    };
  }

  @Get('session')
  @Validate({ response: authSessionSuccessResponseSchema })
  async getSession(
    @Req() request: Request,
  ): Promise<AuthSessionSuccessResponse> {
    const sessionToken = this.authCookieService.extractSessionToken(
      request.headers.cookie,
    );

    const session = await this.authService.getSession(sessionToken);

    if (!session) {
      return {
        code: 'auth.session.success',
        message: 'Session fetched',
        data: { authenticated: false },
      };
    }

    return {
      code: 'auth.session.success',
      message: 'Session valid',
      data: {
        authenticated: true,
        user: {
          id: session.userId,
          email: session.email,
          name: session.name,
          emailVerified: session.emailVerified,
        },
      },
    };
  }

  @Post('forgot-password')
  @Validate({
    request: [{ type: 'body', schema: authForgotPasswordBodySchema }],
    response: authEmptySuccessResponseSchema,
  })
  async forgotPassword(
    @Body() body: AuthForgotPasswordBody,
  ): Promise<AuthEmptySuccessResponse> {
    await this.authService.forgotPassword(body);

    return {
      code: 'auth.forgot_password.success',
      message: 'Password reset email requested',
      data: {},
    };
  }

  @Post('reset-password')
  @Validate({
    request: [{ type: 'body', schema: authResetPasswordBodySchema }],
    response: authEmptySuccessResponseSchema,
  })
  async resetPassword(
    @Body() body: AuthResetPasswordBody,
  ): Promise<AuthEmptySuccessResponse> {
    await this.authService.resetPassword(body);

    return {
      code: 'auth.reset_password.success',
      message: 'Password reset',
      data: {},
    };
  }

  @Get('verify-email')
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
    await this.authService.verifyEmail(token);

    return {
      code: 'auth.verify_email.success',
      message: 'Email verified',
      data: {},
    };
  }
}

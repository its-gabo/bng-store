import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseCookie } from 'cookie';

import { AUTH_SESSION_COOKIE } from '../constants/auth.constants';

import type { AuthConfig } from '../../config/auth/auth.types';
import type { CookieOptions } from 'express';

@Injectable()
export class AuthCookieService {
  constructor(
    private readonly configService: ConfigService<AuthConfig, true>,
  ) {}

  getSessionCookieName(): string {
    return this.configService.get('auth.AUTH_COOKIE_NAME', { infer: true });
  }

  getSessionCookieOptions(expiresAt: Date): CookieOptions {
    return {
      ...this.getClearCookieOptions(),
      expires: expiresAt,
    };
  }

  getClearCookieOptions(): CookieOptions {
    return {
      httpOnly: AUTH_SESSION_COOKIE.HTTP_ONLY,
      secure: this.configService.get('auth.AUTH_COOKIE_SECURE', {
        infer: true,
      }),
      sameSite: this.configService.get('auth.AUTH_COOKIE_SAME_SITE', {
        infer: true,
      }),
      path: AUTH_SESSION_COOKIE.PATH,
    };
  }

  extractSessionToken(cookieHeader?: string): string | null {
    if (!cookieHeader) return null;

    const sessionToken = parseCookie(cookieHeader)[this.getSessionCookieName()];

    if (!sessionToken) return null;

    return sessionToken;
  }
}

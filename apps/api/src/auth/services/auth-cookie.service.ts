import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseCookie } from 'cookie';

import { AUTH_SETTINGS } from '../constants/auth.constants';

import type { CookieOptions } from 'express';

@Injectable()
export class AuthCookieService {
  private readonly cookieSecure: boolean;

  constructor(private readonly configService: ConfigService) {
    this.cookieSecure = this.configService.getOrThrow<boolean>(
      'auth.AUTH_COOKIE_SECURE',
    );
  }

  getSessionCookieName(): string {
    return AUTH_SETTINGS.COOKIE_NAME;
  }

  getSessionCookieOptions(expiresAt: Date): CookieOptions {
    return {
      ...this.getClearCookieOptions(),
      expires: expiresAt,
    };
  }

  getClearCookieOptions(): CookieOptions {
    return {
      httpOnly: AUTH_SETTINGS.COOKIE_HTTP_ONLY,
      secure: this.cookieSecure,
      sameSite: AUTH_SETTINGS.COOKIE_SAME_SITE,
      path: '/',
    };
  }

  extractSessionToken(cookieHeader?: string): string | null {
    if (!cookieHeader) return null;

    const sessionToken = parseCookie(cookieHeader)[AUTH_SETTINGS.COOKIE_NAME];

    if (!sessionToken) return null;

    return sessionToken;
  }
}

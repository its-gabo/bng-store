import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AUTH_ACTION_PATHS } from '../constants/auth.constants';

import type { AuthConfig } from '../../config/auth/auth.types';

@Injectable()
export class AuthActionLinkService {
  constructor(
    private readonly configService: ConfigService<AuthConfig, true>,
  ) {}

  buildEmailVerificationUrl(token: string, redirectTo?: string): string {
    const searchParams = new URLSearchParams({ token });

    if (redirectTo) searchParams.set('redirectTo', redirectTo);

    return this.buildWebAppUrl(AUTH_ACTION_PATHS.VERIFY_EMAIL, searchParams);
  }

  buildPasswordResetUrl(token: string): string {
    return this.buildWebAppUrl(
      AUTH_ACTION_PATHS.RESET_PASSWORD,
      new URLSearchParams({ token }),
    );
  }

  private buildWebAppUrl(path: string, searchParams: URLSearchParams): string {
    return `${this.configService.get('auth.CORS_ORIGIN', { infer: true })}${path}?${searchParams.toString()}`;
  }
}

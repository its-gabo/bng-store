import { Injectable } from '@nestjs/common';

import { DomainError } from '../../common/errors/domain-error';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { AuthCookieService } from '../services/auth-cookie.service';
import { AuthSessionService } from '../services/auth-session.service';

import type { AuthenticatedRequest } from '../types/auth.types';
import type { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Rejects requests without a valid session cookie and attaches the session
 * to the request, so handlers can read it with `@CurrentUser()`.
 */
@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const sessionToken = this.authCookieService.extractSessionToken(
      request.headers.cookie,
    );

    const session = await this.authSessionService.getSession(sessionToken);

    if (!session) throw new DomainError(AUTH_ERRORS.SESSION_REQUIRED);

    request.authSession = session;

    return true;
  }
}

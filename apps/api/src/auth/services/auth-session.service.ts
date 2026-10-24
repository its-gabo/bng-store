import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DomainError } from '../../common/errors/domain-error';
import { HOUR_MS } from '../../common/time/time.constants';
import { UsersService } from '../../users/services/users.service';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { AuthRepository } from '../repository/auth.repository';

import { AuthPasswordService } from './auth-password.service';
import { AuthTokenService } from './auth-token.service';

import type { AuthConfig } from '../../config/auth/auth.types';
import type {
  AuthRequestMetadata,
  AuthSignInInput,
  AuthSignInResult,
  AuthUserSession,
} from '../types/auth.types';

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authPasswordService: AuthPasswordService,
    private readonly authTokenService: AuthTokenService,
    private readonly configService: ConfigService<AuthConfig, true>,
    private readonly usersService: UsersService,
  ) {}

  async signInEmail(
    input: AuthSignInInput,
    metadata: AuthRequestMetadata,
  ): Promise<AuthSignInResult> {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) throw new DomainError(AUTH_ERRORS.INVALID_CREDENTIALS);

    const credential = await this.authRepository.findCredentialByUserId(
      user.id,
    );

    if (!credential) throw new DomainError(AUTH_ERRORS.INVALID_CREDENTIALS);

    const isValidPassword = await this.authPasswordService.verifyPassword(
      credential.passwordHash,
      input.password,
    );

    if (!isValidPassword)
      throw new DomainError(AUTH_ERRORS.INVALID_CREDENTIALS);

    if (!user.emailVerified) {
      throw new DomainError(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
    }

    const { tokenHash, rawToken, expiresAt } =
      this.authTokenService.prepareTokenWithExpiry(
        this.configService.get('auth.AUTH_SESSION_TTL_HOURS', { infer: true }) *
          HOUR_MS,
      );

    const { ipAddress, userAgent } = metadata;
    const { id: userId, email, name, emailVerified } = user;

    await this.authRepository.createSession({
      userId,
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return {
      sessionToken: rawToken,
      session: {
        userId,
        email,
        name,
        emailVerified,
        expiresAt,
      },
    };
  }

  async getSession(
    sessionToken: string | null,
  ): Promise<AuthUserSession | null> {
    if (!sessionToken) return null;

    const tokenHash = this.authTokenService.hashToken(sessionToken);

    const session = await this.authRepository.findSessionByTokenHash(tokenHash);

    if (!session) return null;

    if (session.expiresAt <= new Date()) {
      await this.authRepository.deleteSessionByTokenHash(tokenHash);
      return null;
    }

    return session;
  }

  async signOut(sessionToken: string | null): Promise<void> {
    if (!sessionToken) return;

    const tokenHash = this.authTokenService.hashToken(sessionToken);

    await this.authRepository.deleteSessionByTokenHash(tokenHash);
  }
}

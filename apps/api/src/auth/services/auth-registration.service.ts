import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DomainError } from '../../common/errors/domain-error';
import { HOUR_MS } from '../../common/time/time.constants';
import { UsersService } from '../../users/services/users.service';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { AuthRepository } from '../repository/auth.repository';

import { AuthActionLinkService } from './auth-action-link.service';
import { AuthEmailService } from './auth-email.service';
import { AuthPasswordService } from './auth-password.service';
import { AuthTokenService } from './auth-token.service';

import type { AuthConfig } from '../../config/auth/auth.types';
import type { AuthSignUpInput } from '../types/auth.types';

@Injectable()
export class AuthRegistrationService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authPasswordService: AuthPasswordService,
    private readonly authTokenService: AuthTokenService,
    private readonly authActionLinkService: AuthActionLinkService,
    private readonly authEmailService: AuthEmailService,
    private readonly configService: ConfigService<AuthConfig, true>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates the user with a password credential and queues the welcome
   * email with an email verification link.
   */
  async signUpEmail(input: AuthSignUpInput): Promise<void> {
    const { email, password, name, redirectTo } = input;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) throw new DomainError(AUTH_ERRORS.USER_ALREADY_EXISTS);

    const passwordHash = await this.authPasswordService.hashPassword(password);

    const verificationToken = this.authTokenService.prepareTokenWithExpiry(
      this.configService.get('auth.AUTH_EMAIL_VERIFICATION_TTL_HOURS', {
        infer: true,
      }) * HOUR_MS,
    );
    const verificationUrl =
      this.authActionLinkService.buildEmailVerificationUrl(
        verificationToken.rawToken,
        redirectTo,
      );

    const welcomeEmail = await this.authEmailService.renderWelcomeVerifyEmail({
      email,
      name,
      verificationUrl,
    });

    await this.authRepository.createUserCredentialAndVerificationToken({
      email,
      name,
      passwordHash,
      verificationTokenHash: verificationToken.tokenHash,
      verificationTokenExpiresAt: verificationToken.expiresAt,
      welcomeEmail,
    });
  }
}

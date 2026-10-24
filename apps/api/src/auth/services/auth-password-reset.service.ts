import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DomainError } from '../../common/errors/domain-error';
import { MINUTE_MS } from '../../common/time/time.constants';
import { UsersService } from '../../users/services/users.service';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { AuthRepository } from '../repository/auth.repository';

import { AuthActionLinkService } from './auth-action-link.service';
import { AuthEmailService } from './auth-email.service';
import { AuthPasswordService } from './auth-password.service';
import { AuthTokenService } from './auth-token.service';

import type { AuthConfig } from '../../config/auth/auth.types';
import type {
  AuthForgotPasswordInput,
  AuthResetPasswordInput,
} from '../types/auth.types';

@Injectable()
export class AuthPasswordResetService {
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
   * Queues a password reset email. Unknown emails are ignored silently so
   * the endpoint does not reveal which accounts exist.
   */
  async requestPasswordReset(input: AuthForgotPasswordInput): Promise<void> {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) return;

    const { tokenHash, rawToken, expiresAt } =
      this.authTokenService.prepareTokenWithExpiry(
        this.configService.get('auth.AUTH_PASSWORD_RESET_TTL_MINUTES', {
          infer: true,
        }) * MINUTE_MS,
      );

    const { id: userId, email, name } = user;

    const resetUrl = this.authActionLinkService.buildPasswordResetUrl(rawToken);
    const resetEmail = await this.authEmailService.renderResetPasswordEmail({
      email,
      name,
      resetUrl,
    });

    await this.authRepository.createPasswordResetToken({
      userId,
      tokenHash,
      expiresAt,
      resetEmail,
    });
  }

  /** Sets a new password and signs the user out of every session. */
  async resetPassword(input: AuthResetPasswordInput): Promise<void> {
    const tokenHash = this.authTokenService.hashToken(input.token);
    const passwordHash = await this.authPasswordService.hashPassword(
      input.password,
    );

    await this.authRepository.transaction(async (manager) => {
      const token = await this.authRepository.consumePasswordResetToken(
        tokenHash,
        manager,
      );

      if (!token) {
        throw new DomainError(AUTH_ERRORS.INVALID_PASSWORD_RESET_TOKEN);
      }

      await this.authRepository.updateCredentialPasswordHash(
        { userId: token.userId, passwordHash },
        manager,
      );

      await this.authRepository.deleteSessionsByUserId(token.userId, manager);
    });
  }
}

import { Injectable } from '@nestjs/common';

import { DomainError } from '../../common/errors/domain-error';
import { UsersService } from '../../users/services/users.service';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { AuthRepository } from '../repository/auth.repository';

import { AuthTokenService } from './auth-token.service';

@Injectable()
export class AuthEmailVerificationService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authTokenService: AuthTokenService,
    private readonly usersService: UsersService,
  ) {}

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = this.authTokenService.hashToken(token);

    await this.authRepository.transaction(async (manager) => {
      const verificationToken =
        await this.authRepository.consumeEmailVerificationToken(
          tokenHash,
          manager,
        );

      if (!verificationToken) {
        throw new DomainError(AUTH_ERRORS.INVALID_EMAIL_VERIFICATION_TOKEN);
      }

      await this.usersService.markEmailVerified(
        verificationToken.userId,
        manager,
      );
    });
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApiException } from '../../common/http/response/response.exception';
import { UsersService } from '../../users/services/users.service';
import { AUTH_SETTINGS } from '../constants/auth.constants';
import { AuthEmailService } from '../email/auth-email.service';
import { AuthRepository } from '../repository/auth.repository';

import { AuthPasswordService } from './auth-password.service';
import { AuthTokenService } from './auth-token.service';

import type {
  AuthForgotPasswordInput,
  AuthRequestMetadata,
  AuthResetPasswordInput,
  AuthSignInInput,
  AuthSignInResult,
  AuthSignUpInput,
  AuthUserSession,
} from '../types/auth.types';

@Injectable()
export class AuthService {
  private readonly authWebUrl: string;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authPasswordService: AuthPasswordService,
    private readonly authTokenService: AuthTokenService,
    private readonly authEmailService: AuthEmailService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.authWebUrl = this.configService.getOrThrow<string>('auth.CORS_ORIGIN');
  }

  async signUpEmail(input: AuthSignUpInput): Promise<void> {
    const { password, name } = input;
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ApiException(HttpStatus.CONFLICT, {
        code: 'auth.sign_up.fail',
        message: 'Failed to create user',
        reason: 'auth.user_exists',
      });
    }

    const passwordHash = await this.authPasswordService.hashPassword(password);

    const verificationToken = this.authTokenService.prepareTokenWithExpiry(
      AUTH_SETTINGS.VERIFY_TOKEN_TTL_MS,
    );
    const verificationUrl = this.buildAuthActionUrl(
      '/verify-email',
      verificationToken.rawToken,
      input.redirectTo,
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

  async signInEmail(
    input: AuthSignInInput,
    metadata: AuthRequestMetadata,
  ): Promise<AuthSignInResult> {
    const user = await this.usersService.findByEmail(
      input.email.trim().toLowerCase(),
    );

    if (!user) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, {
        code: 'auth.sign_in.fail',
        message: 'Failed to sign in',
        reason: 'auth.invalid_credentials',
      });
    }

    const credential = await this.authRepository.findCredentialByUserId(
      user.id,
    );

    if (!credential) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, {
        code: 'auth.sign_in.fail',
        message: 'Failed to sign in',
        reason: 'auth.invalid_credentials',
      });
    }

    const isValidPassword = await this.authPasswordService.verifyPassword(
      credential.passwordHash,
      input.password,
    );

    if (!isValidPassword) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, {
        code: 'auth.sign_in.fail',
        message: 'Failed to sign in',
        reason: 'auth.invalid_credentials',
      });
    }

    if (!user.emailVerified) {
      throw new ApiException(HttpStatus.FORBIDDEN, {
        code: 'auth.sign_in.email_not_verified',
        message: 'Email is not verified',
        reason: 'auth.email_not_verified',
      });
    }

    const { tokenHash, rawToken, expiresAt } =
      this.authTokenService.prepareTokenWithExpiry(
        AUTH_SETTINGS.SESSION_TTL_MS,
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

  async forgotPassword(input: AuthForgotPasswordInput): Promise<void> {
    const user = await this.usersService.findByEmail(
      input.email.trim().toLowerCase(),
    );

    if (!user) return;

    const { tokenHash, rawToken, expiresAt } =
      this.authTokenService.prepareTokenWithExpiry(
        AUTH_SETTINGS.RESET_TOKEN_TTL_MS,
      );

    const { id: userId, email, name } = user;

    const resetUrl = this.buildAuthActionUrl('/reset-password', rawToken);
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
        throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, {
          code: 'auth.reset_password.fail',
          message: 'Failed to reset password',
          reason: 'auth.invalid_or_expired_token',
        });
      }

      await this.authRepository.updateCredentialPasswordHash(
        { userId: token.userId, passwordHash },
        manager,
      );

      await this.authRepository.deleteSessionsByUserId(token.userId, manager);
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = this.authTokenService.hashToken(token);

    await this.authRepository.transaction(async (manager) => {
      const verificationToken =
        await this.authRepository.consumeEmailVerificationToken(
          tokenHash,
          manager,
        );

      if (!verificationToken) {
        throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, {
          code: 'auth.verify_email.fail',
          message: 'Failed to verify email',
          reason: 'auth.invalid_or_expired_token',
        });
      }

      await this.usersService.markEmailVerified(
        verificationToken.userId,
        manager,
      );
    });
  }

  private buildAuthActionUrl(
    path: '/verify-email' | '/reset-password',
    token: string,
    redirectTo?: string,
  ): string {
    const searchParams = new URLSearchParams({ token });

    if (
      redirectTo &&
      redirectTo.startsWith('/') &&
      !redirectTo.startsWith('//')
    ) {
      searchParams.set('redirectTo', redirectTo);
    }

    return `${this.authWebUrl}${path}?${searchParams.toString()}`;
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import authConfig from '../config/auth/auth';
import { OutboxModule } from '../outbox/outbox.module';
import { UsersModule } from '../users/users.module';

import { AuthEmailVerificationController } from './controllers/auth-email-verification.controller';
import { AuthPasswordController } from './controllers/auth-password.controller';
import { AuthRegistrationController } from './controllers/auth-registration.controller';
import { AuthSessionController } from './controllers/auth-session.controller';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { AuthRepository } from './repository/auth.repository';
import { AuthActionLinkService } from './services/auth-action-link.service';
import { AuthCookieService } from './services/auth-cookie.service';
import { AuthEmailVerificationService } from './services/auth-email-verification.service';
import { AuthEmailService } from './services/auth-email.service';
import { AuthPasswordResetService } from './services/auth-password-reset.service';
import { AuthPasswordService } from './services/auth-password.service';
import { AuthRegistrationService } from './services/auth-registration.service';
import { AuthSessionService } from './services/auth-session.service';
import { AuthTokenService } from './services/auth-token.service';

@Module({
  imports: [ConfigModule.forFeature(authConfig), OutboxModule, UsersModule],
  controllers: [
    AuthRegistrationController,
    AuthSessionController,
    AuthPasswordController,
    AuthEmailVerificationController,
  ],
  providers: [
    AuthRepository,
    AuthTokenService,
    AuthPasswordService,
    AuthCookieService,
    AuthEmailService,
    AuthActionLinkService,
    AuthRegistrationService,
    AuthSessionService,
    AuthPasswordResetService,
    AuthEmailVerificationService,
    SessionAuthGuard,
  ],
  exports: [AuthSessionService, AuthCookieService, SessionAuthGuard],
})
export class AuthModule {}

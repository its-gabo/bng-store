import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OutboxModule } from '../outbox/outbox.module';
import { UsersModule } from '../users/users.module';

import { AuthController } from './controllers/auth.controller';
import { AuthEmailService } from './email/auth-email.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthCookieService } from './services/auth-cookie.service';
import { AuthPasswordService } from './services/auth-password.service';
import { AuthTokenService } from './services/auth-token.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [ConfigModule, OutboxModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthTokenService,
    AuthPasswordService,
    AuthCookieService,
    AuthEmailService,
    AuthService,
  ],
  exports: [AuthService, AuthCookieService, AuthTokenService],
})
export class AuthModule {}

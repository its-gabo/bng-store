import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';

import type { AuthConfig } from '../../config/auth/auth.types';
import type { AuthPreparedToken } from '../types/auth.types';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly configService: ConfigService<AuthConfig, true>,
  ) {}

  createRawToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashToken(token: string): string {
    return createHash('sha256')
      .update(
        `${token}:${this.configService.get('auth.AUTH_SECRET', { infer: true })}`,
      )
      .digest('hex');
  }

  prepareTokenWithExpiry(ttlMs: number): AuthPreparedToken {
    const rawToken = this.createRawToken();

    return {
      rawToken,
      tokenHash: this.hashToken(rawToken),
      expiresAt: new Date(Date.now() + ttlMs),
    };
  }
}

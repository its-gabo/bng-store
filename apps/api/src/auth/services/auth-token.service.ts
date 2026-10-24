import { createHash, randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { AuthPreparedToken } from '../types/auth.types';

@Injectable()
export class AuthTokenService {
  private readonly authSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.authSecret = this.configService.getOrThrow<string>('auth.AUTH_SECRET');
  }

  createRawToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashToken(token: string): string {
    return createHash('sha256')
      .update(`${token}:${this.authSecret}`)
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

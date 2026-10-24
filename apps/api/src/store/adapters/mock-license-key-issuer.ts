import { Injectable } from '@nestjs/common';
import { createHash, randomInt } from 'node:crypto';

import { LicenseKeyIssuer } from '../ports/license-key-issuer';

import type { IssuedLicenseKey } from '../types/store.types';

const KEY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const KEY_GROUP_COUNT = 5;
const KEY_GROUP_LENGTH = 5;
const KEY_HINT_LENGTH = 4;

@Injectable()
export class MockLicenseKeyIssuer extends LicenseKeyIssuer {
  issueLicenseKey(): IssuedLicenseKey {
    const plainKey = Array.from({ length: KEY_GROUP_COUNT }, () =>
      this.createKeyGroup(),
    ).join('-');

    return {
      plainKey,
      keyHash: createHash('sha256').update(plainKey).digest('hex'),
      keyHint: plainKey.slice(-KEY_HINT_LENGTH),
    };
  }

  private createKeyGroup(): string {
    return Array.from(
      { length: KEY_GROUP_LENGTH },
      () => KEY_ALPHABET[randomInt(KEY_ALPHABET.length)],
    ).join('');
  }
}

import { Injectable } from '@nestjs/common';
import { issueLicenseKey } from '@workspace/license-keys';

import { LicenseKeyIssuer } from '../ports/license-key-issuer';

import type { IssuedLicenseKey } from '../types/store.types';

@Injectable()
export class GeneratedLicenseKeyIssuer extends LicenseKeyIssuer {
  issueLicenseKey(): IssuedLicenseKey {
    return issueLicenseKey();
  }
}

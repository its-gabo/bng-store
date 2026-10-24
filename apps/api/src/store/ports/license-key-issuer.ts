import type { IssuedLicenseKey } from '../types/store.types';

/**
 * Port to the license key package. Only the hash and hint are stored; the
 * plain key is shown to the user once. Bound to `MockLicenseKeyIssuer` until
 * the dedicated package is available.
 */
export abstract class LicenseKeyIssuer {
  abstract issueLicenseKey(): IssuedLicenseKey;
}

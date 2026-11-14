import type { IssuedLicenseKey } from '../types/store.types';

/**
 * Facade over the license key generator. Each user gets one key, issued on
 * their first purchase. Only the hash and hint are stored; the plain key is
 * shown to the user once. Bound to `MockLicenseKeyIssuer` until the real
 * generator is available.
 */
export abstract class LicenseKeyIssuer {
  abstract issueLicenseKey(): IssuedLicenseKey;
}

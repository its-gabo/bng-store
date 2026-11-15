import { getLicenseKeyHint, hashLicenseKey } from '@workspace/license-keys';
import { match } from 'ts-pattern';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LICENSE_KEY_VALIDATION_STATUSES } from '../constants/store.constants';
import { LicenseKeyEntity } from '../db/license-key.entity';
import { LicenseKeyIssuer } from '../ports/license-key-issuer';
import { StoreLicenseKeysRepository } from '../repository/store-license-keys.repository';
import { StoreSubscriptionsRepository } from '../repository/store-subscriptions.repository';
import { StoreLicenseKeysService } from './store-license-keys.service';
import {
  LICENSE_KEY_OWNER_ID,
  MALFORMED_KEY_SCENARIOS,
  NORMALIZABLE_KEY_SCENARIOS,
  OWNED_APPLICATION_IDS,
  STORED_KEY_SCENARIOS,
  STORED_LICENSE_KEY_STATES,
  VALID_PLAIN_KEY,
} from './store-license-keys.service.scenarios';

type StoredLicenseKeyState =
  (typeof STORED_LICENSE_KEY_STATES)[keyof typeof STORED_LICENSE_KEY_STATES];

describe('StoreLicenseKeysService.validateLicenseKey', () => {
  const storeLicenseKeysRepository = {
    findLicenseKeyByHash: vi.fn(),
  };
  const storeSubscriptionsRepository = {
    findApplicationIdsOwnedByUser: vi.fn(),
    hasUserEndedSubscription: vi.fn(),
  };
  const licenseKeyIssuer = { issueLicenseKey: vi.fn() };

  const storeLicenseKeysService = new StoreLicenseKeysService(
    storeLicenseKeysRepository as unknown as StoreLicenseKeysRepository,
    storeSubscriptionsRepository as unknown as StoreSubscriptionsRepository,
    licenseKeyIssuer as unknown as LicenseKeyIssuer,
  );

  beforeEach(() => {
    storeLicenseKeysRepository.findLicenseKeyByHash.mockReset();
    storeSubscriptionsRepository.findApplicationIdsOwnedByUser.mockReset();
    storeSubscriptionsRepository.hasUserEndedSubscription.mockReset();
    licenseKeyIssuer.issueLicenseKey.mockReset();

    arrangeStoredLicenseKey(STORED_LICENSE_KEY_STATES.ACTIVE);
    storeSubscriptionsRepository.findApplicationIdsOwnedByUser.mockResolvedValue(
      OWNED_APPLICATION_IDS,
    );
    storeSubscriptionsRepository.hasUserEndedSubscription.mockResolvedValue(
      false,
    );
  });

  it.each(MALFORMED_KEY_SCENARIOS)(
    'rejects $name as invalid_format without looking the key up',
    async ({ plainKey }) => {
      const validation =
        await storeLicenseKeysService.validateLicenseKey(plainKey);

      expect(validation).toEqual({
        status: LICENSE_KEY_VALIDATION_STATUSES.INVALID_FORMAT,
        applicationIds: [],
      });
      expect(
        storeLicenseKeysRepository.findLicenseKeyByHash,
      ).not.toHaveBeenCalled();
    },
  );

  it.each(NORMALIZABLE_KEY_SCENARIOS)(
    'accepts a key entered in $name',
    async ({ plainKey }) => {
      const validation =
        await storeLicenseKeysService.validateLicenseKey(plainKey);

      expect(validation).toEqual({
        status: LICENSE_KEY_VALIDATION_STATUSES.VALID,
        applicationIds: OWNED_APPLICATION_IDS,
      });
      expect(
        storeLicenseKeysRepository.findLicenseKeyByHash,
      ).toHaveBeenCalledWith(hashLicenseKey(VALID_PLAIN_KEY));
    },
  );

  it.each(STORED_KEY_SCENARIOS)(
    'reports $expected.status when $name',
    async ({
      storedLicenseKey,
      ownedApplicationIds,
      hasEndedSubscription,
      expected,
    }) => {
      arrangeStoredLicenseKey(storedLicenseKey);
      storeSubscriptionsRepository.findApplicationIdsOwnedByUser.mockResolvedValue(
        ownedApplicationIds,
      );
      storeSubscriptionsRepository.hasUserEndedSubscription.mockResolvedValue(
        hasEndedSubscription,
      );

      const validation =
        await storeLicenseKeysService.validateLicenseKey(VALID_PLAIN_KEY);

      expect(validation).toEqual(expected);
    },
  );

  it("counts every active subscription of the key's owner", async () => {
    await storeLicenseKeysService.validateLicenseKey(VALID_PLAIN_KEY);

    expect(
      storeSubscriptionsRepository.findApplicationIdsOwnedByUser,
    ).toHaveBeenCalledWith({
      userId: LICENSE_KEY_OWNER_ID,
      excludedSubscriptionId: null,
    });
  });

  function arrangeStoredLicenseKey(state: StoredLicenseKeyState): void {
    const licenseKey = match(state)
      .with(STORED_LICENSE_KEY_STATES.MISSING, () => null)
      .with(STORED_LICENSE_KEY_STATES.ACTIVE, () =>
        createLicenseKeyEntity({ revokedAt: null }),
      )
      .with(STORED_LICENSE_KEY_STATES.REVOKED, () =>
        createLicenseKeyEntity({ revokedAt: new Date('2026-10-01T00:00:00Z') }),
      )
      .exhaustive();

    storeLicenseKeysRepository.findLicenseKeyByHash.mockResolvedValue(
      licenseKey,
    );
  }
});

function createLicenseKeyEntity(
  overrides: Pick<LicenseKeyEntity, 'revokedAt'>,
): LicenseKeyEntity {
  return Object.assign(new LicenseKeyEntity(), {
    id: 'e3b8c5d4-3f4a-4b6c-9d0e-1f2a3b4c5d6e',
    userId: LICENSE_KEY_OWNER_ID,
    keyHash: hashLicenseKey(VALID_PLAIN_KEY),
    keyHint: getLicenseKeyHint(VALID_PLAIN_KEY),
    createdAt: new Date('2026-09-01T00:00:00Z'),
    ...overrides,
  });
}

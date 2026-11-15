import { LICENSE_KEY_VALIDATION_STATUSES } from '../constants/store.constants';

export const STORED_LICENSE_KEY_STATES = {
  MISSING: 'missing',
  ACTIVE: 'active',
  REVOKED: 'revoked',
} as const;

export const VALID_PLAIN_KEY = 'ABCDE-FGH23-JKLMN-PQRST-UVW45';
export const LICENSE_KEY_OWNER_ID = '7d1c2f3e-4b5a-4c6d-8e9f-0a1b2c3d4e5f';
export const OWNED_APPLICATION_IDS = [
  'b1f6a3c2-1d2e-4f3a-9b8c-7d6e5f4a3b2c',
  'c2a7b4d3-2e3f-4a5b-8c9d-0e1f2a3b4c5d',
];

export const MALFORMED_KEY_SCENARIOS = [
  { name: 'an empty string', plainKey: '' },
  { name: 'random text', plainKey: 'not-a-license-key' },
  { name: 'too few groups', plainKey: 'ABCDE-FGH23-JKLMN-PQRST' },
  { name: 'a too short group', plainKey: 'ABCDE-FGH23-JKLMN-PQRST-UVW4' },
  { name: 'look-alike characters', plainKey: 'ABCDE-FGH23-JKLMN-PQRST-UVW0O' },
  { name: 'a wrong separator', plainKey: 'ABCDE_FGH23_JKLMN_PQRST_UVW45' },
];

export const NORMALIZABLE_KEY_SCENARIOS = [
  { name: 'lowercase', plainKey: 'abcde-fgh23-jklmn-pqrst-uvw45' },
  {
    name: 'surrounding whitespace',
    plainKey: '  ABCDE-FGH23-JKLMN-PQRST-UVW45\n',
  },
];

export const STORED_KEY_SCENARIOS = [
  {
    name: 'no key matches the hash',
    storedLicenseKey: STORED_LICENSE_KEY_STATES.MISSING,
    ownedApplicationIds: [],
    hasEndedSubscription: false,
    expected: {
      status: LICENSE_KEY_VALIDATION_STATUSES.NOT_FOUND,
      applicationIds: [],
    },
  },
  {
    name: 'the key is revoked, even with active subscriptions',
    storedLicenseKey: STORED_LICENSE_KEY_STATES.REVOKED,
    ownedApplicationIds: OWNED_APPLICATION_IDS,
    hasEndedSubscription: false,
    expected: {
      status: LICENSE_KEY_VALIDATION_STATUSES.REVOKED,
      applicationIds: [],
    },
  },
  {
    name: 'all of the owner subscriptions have ended',
    storedLicenseKey: STORED_LICENSE_KEY_STATES.ACTIVE,
    ownedApplicationIds: [],
    hasEndedSubscription: true,
    expected: {
      status: LICENSE_KEY_VALIDATION_STATUSES.EXPIRED,
      applicationIds: [],
    },
  },
  {
    name: 'the owner has never had a subscription',
    storedLicenseKey: STORED_LICENSE_KEY_STATES.ACTIVE,
    ownedApplicationIds: [],
    hasEndedSubscription: false,
    expected: {
      status: LICENSE_KEY_VALIDATION_STATUSES.NO_ACTIVE_SUBSCRIPTION,
      applicationIds: [],
    },
  },
  {
    name: 'the owner has active subscriptions',
    storedLicenseKey: STORED_LICENSE_KEY_STATES.ACTIVE,
    ownedApplicationIds: OWNED_APPLICATION_IDS,
    hasEndedSubscription: true,
    expected: {
      status: LICENSE_KEY_VALIDATION_STATUSES.VALID,
      applicationIds: OWNED_APPLICATION_IDS,
    },
  },
];

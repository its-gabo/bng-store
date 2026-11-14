import { createHash, randomInt } from "node:crypto"

import {
  LICENSE_KEY_ALPHABET,
  LICENSE_KEY_GROUP_COUNT,
  LICENSE_KEY_GROUP_LENGTH,
  LICENSE_KEY_GROUP_SEPARATOR,
  LICENSE_KEY_HINT_LENGTH,
} from "./license-key.constants"

import type { IssuedLicenseKey } from "./license-key.types"

const LICENSE_KEY_PATTERN = new RegExp(
  `^[${LICENSE_KEY_ALPHABET}]{${LICENSE_KEY_GROUP_LENGTH}}` +
    `(${LICENSE_KEY_GROUP_SEPARATOR}[${LICENSE_KEY_ALPHABET}]{${LICENSE_KEY_GROUP_LENGTH}}){${LICENSE_KEY_GROUP_COUNT - 1}}$`
)

/** Generates a random key like `ABCDE-FGH23-...` (125 bits of entropy). */
export function generateLicenseKey(): string {
  return Array.from({ length: LICENSE_KEY_GROUP_COUNT }, createKeyGroup).join(
    LICENSE_KEY_GROUP_SEPARATOR
  )
}

/**
 * Uppercases and trims a user-entered key so lookups don't fail on casing or
 * stray whitespace. Hash keys only after normalizing them.
 */
export function normalizeLicenseKey(key: string): string {
  return key.trim().toUpperCase()
}

export function isLicenseKeyFormat(key: string): boolean {
  return LICENSE_KEY_PATTERN.test(key)
}

export function hashLicenseKey(key: string): string {
  return createHash("sha256").update(normalizeLicenseKey(key)).digest("hex")
}

export function getLicenseKeyHint(key: string): string {
  return normalizeLicenseKey(key).slice(-LICENSE_KEY_HINT_LENGTH)
}

/**
 * Generates a new key with the values to persist. Store only `keyHash` and
 * `keyHint`; `plainKey` is meant to be shown to the user once.
 */
export function issueLicenseKey(): IssuedLicenseKey {
  const plainKey = generateLicenseKey()

  return {
    plainKey,
    keyHash: hashLicenseKey(plainKey),
    keyHint: getLicenseKeyHint(plainKey),
  }
}

function createKeyGroup(): string {
  return Array.from(
    { length: LICENSE_KEY_GROUP_LENGTH },
    () => LICENSE_KEY_ALPHABET[randomInt(LICENSE_KEY_ALPHABET.length)]
  ).join("")
}

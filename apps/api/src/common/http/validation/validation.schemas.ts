import { Type } from '@sinclair/typebox';

import { VALIDATION_FORMATS } from './validation.constants';

const PASSWORD_MIN_LENGTH = 8;
const REDIRECT_PATH_MAX_LENGTH = 2048;

export const uuidSchema = Type.String({ format: VALIDATION_FORMATS.UUID });

export const dateTimeSchema = Type.String({
  format: VALIDATION_FORMATS.DATE_TIME,
});

/** Accepts an email address in any casing and decodes it trimmed and lowercased. */
export const emailSchema = Type.Transform(
  Type.String({ minLength: 3, format: VALIDATION_FORMATS.EMAIL }),
)
  .Decode((email) => email.trim().toLowerCase())
  .Encode((email) => email);

export const personNameSchema = Type.Transform(Type.String({ minLength: 1 }))
  .Decode((name) => name.trim())
  .Encode((name) => name);

export const passwordSchema = Type.String({ minLength: PASSWORD_MIN_LENGTH });

export const opaqueTokenSchema = Type.String({ minLength: 1 });

/** Same-origin path only, so it cannot be abused as an open redirect. */
export const safeRedirectPathSchema = Type.String({
  minLength: 1,
  maxLength: REDIRECT_PATH_MAX_LENGTH,
  format: VALIDATION_FORMATS.SAFE_REDIRECT_PATH,
});

import { FormatRegistry } from '@sinclair/typebox';

import { isSafeRedirectPath } from '../../utils/url.utils';

import { VALIDATION_FORMATS } from './validation.constants';

const EMAIL_REGEX = /.+@.+\..+/;
const UUID_REGEX =
  /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}[tT\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[zZ]|[+-]\d{2}:?\d{2})?$/;

export const registerValidationFormats = (): void => {
  FormatRegistry.Set(VALIDATION_FORMATS.EMAIL, (value) =>
    EMAIL_REGEX.test(value.trim()),
  );
  FormatRegistry.Set(VALIDATION_FORMATS.UUID, (value) =>
    UUID_REGEX.test(value),
  );
  FormatRegistry.Set(
    VALIDATION_FORMATS.DATE_TIME,
    (value) => DATE_TIME_REGEX.test(value) && !Number.isNaN(Date.parse(value)),
  );
  FormatRegistry.Set(VALIDATION_FORMATS.SAFE_REDIRECT_PATH, isSafeRedirectPath);
};

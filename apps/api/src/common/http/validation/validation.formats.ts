import { FormatRegistry } from '@sinclair/typebox';

const EMAIL_REGEX = /.+@.+\..+/;
const UUID_REGEX =
  /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}[tT\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[zZ]|[+-]\d{2}:?\d{2})?$/;

export const registerValidationFormats = (): void => {
  FormatRegistry.Set('email', (value) => EMAIL_REGEX.test(value));
  FormatRegistry.Set('uuid', (value) => UUID_REGEX.test(value));
  FormatRegistry.Set(
    'date-time',
    (value) => DATE_TIME_REGEX.test(value) && !Number.isNaN(Date.parse(value)),
  );
};

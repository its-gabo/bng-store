export const RESPONSE_VALIDATOR_METADATA = 'http:response-validator';

export const VALIDATION_TARGETS = {
  BODY: 'body',
  QUERY: 'query',
  PARAM: 'param',
  RESPONSE: 'response',
} as const;

export const SWAGGER_SCHEMA_REF_PREFIX = '#/components/schemas/';

export const VALIDATION_FORMATS = {
  EMAIL: 'email',
  UUID: 'uuid',
  DATE_TIME: 'date-time',
  SAFE_REDIRECT_PATH: 'safe-redirect-path',
} as const;

export const API_ERROR_RESPONSE_SCHEMA_NAME = 'ApiErrorResponse';

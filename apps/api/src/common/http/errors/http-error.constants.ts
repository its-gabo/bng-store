import type { ApiErrorResponseCatalog } from '../response/response.types';

export const HTTP_ERROR_CODES = {
  REQUEST_FAILED: 'common.request_failed',
  INTERNAL_ERROR: 'common.internal_error',
} as const;

export const HTTP_ERROR_RESPONSES = {
  REQUEST_FAILED: {
    code: HTTP_ERROR_CODES.REQUEST_FAILED,
    message: 'Request failed',
    reason: HTTP_ERROR_CODES.REQUEST_FAILED,
  },
  INTERNAL_ERROR: {
    code: HTTP_ERROR_CODES.INTERNAL_ERROR,
    message: 'Internal server error',
    reason: HTTP_ERROR_CODES.INTERNAL_ERROR,
  },
} as const satisfies ApiErrorResponseCatalog<typeof HTTP_ERROR_CODES>;

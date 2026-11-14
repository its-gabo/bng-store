import type { ApiResult } from './response.types';

export const createApiSuccessResponse = <TData>(
  result: ApiResult,
  data: TData,
): { code: string; message: string; data: TData } => ({
  code: result.code,
  message: result.message,
  data,
});

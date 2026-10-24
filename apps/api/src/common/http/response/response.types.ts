import type {
  apiErrorResponseSchema,
  apiPaginationSchema,
  createApiPaginatedResponseSchema,
  createApiSuccessResponseSchema,
} from './response.schemas';
import type { Static, TSchema } from '@sinclair/typebox';

export type ApiPagination = Static<typeof apiPaginationSchema>;
export type ApiErrorResponseFromSchema = Static<typeof apiErrorResponseSchema>;
export type ApiSuccessResponseFromSchema<TDataSchema extends TSchema> = Static<
  ReturnType<typeof createApiSuccessResponseSchema<TDataSchema>>
>;
export type ApiPaginatedResponseFromSchema<TDataSchema extends TSchema> =
  Static<ReturnType<typeof createApiPaginatedResponseSchema<TDataSchema>>>;

export type ApiErrorResponse = ApiErrorResponseFromSchema;

export type ApiResult<TCode extends string = string> = {
  code: TCode;
  message: string;
};

/** One `ApiResult` per key of `TCodes`, each bound to exactly that key's code. */
export type ApiResultCatalog<TCodes extends Record<string, string>> = {
  readonly [Name in keyof TCodes]: ApiResult<TCodes[Name]>;
};

/** One error response per key of `TCodes`, each bound to exactly that key's code. */
export type ApiErrorResponseCatalog<TCodes extends Record<string, string>> = {
  readonly [Name in keyof TCodes]: ApiErrorResponse & { code: TCodes[Name] };
};

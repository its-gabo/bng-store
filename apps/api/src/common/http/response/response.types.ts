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

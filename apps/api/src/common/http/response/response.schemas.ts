import { Type } from '@sinclair/typebox';

import type { TSchema } from '@sinclair/typebox';

export const apiPaginationSchema = Type.Object({
  limit: Type.Number({ minimum: 1 }),
  nextCursor: Type.Union([Type.String({ minLength: 1 }), Type.Null()]),
  hasMore: Type.Boolean(),
});

export const apiValidationErrorSchema = Type.Object({
  path: Type.String(),
  message: Type.String(),
});

export const apiErrorResponseSchema = Type.Object({
  code: Type.String({ minLength: 1 }),
  message: Type.String({ minLength: 1 }),
  reason: Type.String({ minLength: 1 }),
  errors: Type.Optional(Type.Array(apiValidationErrorSchema)),
});

export const createApiSuccessResponseSchema = <TDataSchema extends TSchema>(
  dataSchema: TDataSchema,
) =>
  Type.Object({
    code: Type.String({ minLength: 1 }),
    message: Type.String({ minLength: 1 }),
    data: dataSchema,
  });

export const createApiPaginatedResponseSchema = <TDataSchema extends TSchema>(
  dataSchema: TDataSchema,
) =>
  Type.Object({
    code: Type.String({ minLength: 1 }),
    message: Type.String({ minLength: 1 }),
    data: dataSchema,
    pagination: apiPaginationSchema,
  });

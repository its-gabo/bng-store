import { Type } from '@sinclair/typebox';

export const keyValueStoreSchema = Type.Object({
  REDIS_URL: Type.String({ minLength: 1 }),
});

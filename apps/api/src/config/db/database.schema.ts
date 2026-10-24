import { Type } from '@sinclair/typebox';

export const databaseSchema = Type.Object({
  DATABASE_URL: Type.String({ minLength: 1 }),
});

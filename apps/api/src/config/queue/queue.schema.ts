import { Type } from '@sinclair/typebox';

export const queueSchema = Type.Object({
  RABBITMQ_URL: Type.String({ minLength: 1 }),
});

import { Type } from '@sinclair/typebox';

export const storeSchema = Type.Object({
  STORE_PENDING_ORDER_TTL_MINUTES: Type.Integer({ minimum: 1 }),
  STORE_MAINTENANCE_CRON: Type.String({ minLength: 1 }),
  STORE_MAINTENANCE_BATCH_SIZE: Type.Integer({ minimum: 1 }),
});

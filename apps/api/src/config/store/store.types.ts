import type { storeSchema } from './store.schema';
import type { Static } from '@sinclair/typebox';

export type StoreConfigSchema = Static<typeof storeSchema>;

export type StoreConfig = { store: StoreConfigSchema };

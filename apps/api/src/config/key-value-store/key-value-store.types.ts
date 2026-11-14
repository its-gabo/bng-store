import type { keyValueStoreSchema } from './key-value-store.schema';
import type { Static } from '@sinclair/typebox';

export type KeyValueStoreConfigSchema = Static<typeof keyValueStoreSchema>;

export type KeyValueStoreConfig = { keyValueStore: KeyValueStoreConfigSchema };

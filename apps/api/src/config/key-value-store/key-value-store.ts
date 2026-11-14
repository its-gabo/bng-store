import { registerAs } from '@nestjs/config';

import { configValidator } from '../utils/config.validator';

import { keyValueStoreSchema } from './key-value-store.schema';

import type { KeyValueStoreConfigSchema } from './key-value-store.types';

const validateKeyValueStoreConfig = configValidator(keyValueStoreSchema);

export default registerAs('keyValueStore', (): KeyValueStoreConfigSchema => {
  const values = {
    REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
  };

  return validateKeyValueStoreConfig(values);
});

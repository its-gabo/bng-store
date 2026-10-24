import { registerAs } from '@nestjs/config';

import { parseIntegerEnv } from '../utils/config-env.parsers';
import { configValidator } from '../utils/config.validator';

import { storeSchema } from './store.schema';

import type { StoreConfigSchema } from './store.types';

const STORE_MAINTENANCE_DEFAULT_CRON = '* * * * *';

const validateStoreConfig = configValidator(storeSchema);

export default registerAs('store', (): StoreConfigSchema => {
  const values = {
    STORE_PENDING_ORDER_TTL_MINUTES: parseIntegerEnv(
      process.env.STORE_PENDING_ORDER_TTL_MINUTES,
      30,
    ),
    STORE_MAINTENANCE_CRON:
      process.env.STORE_MAINTENANCE_CRON ?? STORE_MAINTENANCE_DEFAULT_CRON,
    STORE_MAINTENANCE_BATCH_SIZE: parseIntegerEnv(
      process.env.STORE_MAINTENANCE_BATCH_SIZE,
      50,
    ),
  };

  return validateStoreConfig(values);
});

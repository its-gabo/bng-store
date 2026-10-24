import { registerAs } from '@nestjs/config';

import { configValidator } from '../config.validator';

import { databaseSchema } from './database.schema';

import type { DatabaseConfigSchema } from './database.types';

const validateDatabaseConfig = configValidator(databaseSchema);

export default registerAs('database', (): DatabaseConfigSchema => {
  const values = {
    DATABASE_URL: process.env.DATABASE_URL,
  };

  return validateDatabaseConfig(values);
});

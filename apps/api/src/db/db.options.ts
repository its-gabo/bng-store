import { join } from 'node:path';

import { DB_MIGRATIONS_TABLE } from './db.constants';
import { DB_ENTITIES } from './db.entities';

import type { DataSourceOptions } from 'typeorm';

export const createDataSourceOptions = (
  databaseUrl: string,
): DataSourceOptions => ({
  type: 'postgres',
  url: databaseUrl,
  entities: DB_ENTITIES,
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsTableName: DB_MIGRATIONS_TABLE,
  synchronize: false,
  uuidExtension: 'pgcrypto',
  installExtensions: false,
});

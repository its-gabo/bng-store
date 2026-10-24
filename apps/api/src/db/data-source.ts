import 'reflect-metadata';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { createDataSourceOptions } from './db.options';

config({
  path: ['.env', '../../.env'],
  quiet: true,
});

if (!process.env.DATABASE_URL) {
  throw new Error('[DB] DATABASE_URL is required');
}

export default new DataSource(
  createDataSourceOptions(process.env.DATABASE_URL),
);

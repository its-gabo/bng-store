import type { databaseSchema } from './database.schema';
import type { Static } from '@sinclair/typebox';

export type DatabaseConfigSchema = Static<typeof databaseSchema>;

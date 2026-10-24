import type { authSchema } from './auth.schema';
import type { Static } from '@sinclair/typebox';

export type AuthConfigSchema = Static<typeof authSchema>;

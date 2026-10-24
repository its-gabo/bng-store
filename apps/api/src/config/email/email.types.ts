import type { emailSchema } from './email.schema';
import type { Static } from '@sinclair/typebox';

export type EmailConfigSchema = Static<typeof emailSchema>;

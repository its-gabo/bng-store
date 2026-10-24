import type { queueSchema } from './queue.schema';
import type { Static } from '@sinclair/typebox';

export type QueueConfigSchema = Static<typeof queueSchema>;

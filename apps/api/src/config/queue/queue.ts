import { registerAs } from '@nestjs/config';

import { configValidator } from '../config.validator';

import { queueSchema } from './queue.schema';

import type { QueueConfigSchema } from './queue.types';

const validateQueueConfig = configValidator(queueSchema);

export default registerAs('queue', (): QueueConfigSchema => {
  const values = {
    RABBITMQ_URL:
      process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
  };

  return validateQueueConfig(values);
});

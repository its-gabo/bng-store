import { Redis } from 'ioredis';

import { REDIS_CONNECTION } from '../constants/key-value-store.constants';

import type { KeyValueStoreConfig } from '../../config/key-value-store/key-value-store.types';
import type { ConfigService } from '@nestjs/config';

/**
 * Creates the shared Redis client. Commands time out quickly instead of
 * waiting for a reconnection, so requests do not hang while Redis is
 * unavailable.
 */
export const createRedisClient = (
  configService: ConfigService<KeyValueStoreConfig, true>,
): Redis =>
  new Redis(configService.get('keyValueStore.REDIS_URL', { infer: true }), {
    connectTimeout: REDIS_CONNECTION.CONNECT_TIMEOUT_MS,
    commandTimeout: REDIS_CONNECTION.COMMAND_TIMEOUT_MS,
    maxRetriesPerRequest: REDIS_CONNECTION.MAX_RETRIES_PER_REQUEST,
  });

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import keyValueStoreConfig from '../config/key-value-store/key-value-store';

import { createRedisClient } from './factories/redis-client.factory';
import { RedisConnectionLifecycleService } from './services/redis-connection-lifecycle.service';

@Module({
  imports: [ConfigModule.forFeature(keyValueStoreConfig)],
  providers: [
    { provide: Redis, inject: [ConfigService], useFactory: createRedisClient },
    RedisConnectionLifecycleService,
  ],
  exports: [Redis],
})
export class KeyValueStoreModule {}

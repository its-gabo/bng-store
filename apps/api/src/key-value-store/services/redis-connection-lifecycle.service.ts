import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import type { OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class RedisConnectionLifecycleService implements OnApplicationShutdown {
  constructor(private readonly redis: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    await this.redis.quit();
  }
}

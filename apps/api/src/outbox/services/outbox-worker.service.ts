import { randomUUID } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';

import { RabbitMqService } from '../../queue/rabbitmq.service';
import { OUTBOX_EMAIL_QUEUE } from '../../queue/queue.constants';
import {
  OUTBOX_MESSAGE_TYPE,
  OUTBOX_SETTINGS,
} from '../constants/outbox.constants';
import { OutboxRepository } from '../repository/outbox.repository';

import type { OutboxEmailJob, OutboxEmailMessage } from '../types/outbox.types';
import type { OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class OutboxWorkerService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(OutboxWorkerService.name);
  private readonly workerId = randomUUID();
  private timer: ReturnType<typeof setInterval> | null = null;
  private polling = false;

  constructor(
    private readonly outboxRepository: OutboxRepository,
    private readonly rabbitMqService: RabbitMqService,
  ) {}

  onApplicationBootstrap(): void {
    this.timer = setInterval(
      () => void this.poll(),
      OUTBOX_SETTINGS.POLL_INTERVAL_MS,
    );
    void this.poll();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async poll(): Promise<void> {
    if (this.polling) return;

    this.polling = true;

    try {
      await this.outboxRepository.cleanupTerminalMessages(
        OUTBOX_SETTINGS.TERMINAL_RETENTION_MS,
        OUTBOX_SETTINGS.CLEANUP_BATCH_SIZE,
      );

      const messages = await this.outboxRepository.claimBatch(
        this.workerId,
        OUTBOX_SETTINGS.BATCH_SIZE,
        OUTBOX_SETTINGS.LEASE_MS,
      );

      await Promise.all(messages.map((message) => this.publish(message)));
    } catch (error) {
      this.logger.error(
        `Failed to poll outbox: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      this.polling = false;
    }
  }

  private async publish(message: OutboxEmailMessage): Promise<void> {
    if (message.type !== OUTBOX_MESSAGE_TYPE.EMAIL) {
      throw new Error(`Unsupported outbox message type: ${message.type}`);
    }

    const job: OutboxEmailJob = {
      id: message.id,
      type: message.type,
      payload: message.payload,
      attempts: message.attempts,
      workerId: this.workerId,
    };

    await this.rabbitMqService.publish(OUTBOX_EMAIL_QUEUE, job, {
      messageId: message.id,
      type: message.type,
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';

import { EmailService } from '../../email/email.service';
import { OUTBOX_EMAIL_QUEUE } from '../../queue/queue.constants';
import { RabbitMqService } from '../../queue/rabbitmq.service';
import {
  OUTBOX_MESSAGE_TYPE,
  OUTBOX_SETTINGS,
} from '../constants/outbox.constants';
import { OutboxRepository } from '../repository/outbox.repository';

import type { OutboxEmailJob } from '../types/outbox.types';
import type { OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class OutboxEmailConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(OutboxEmailConsumer.name);

  constructor(
    private readonly outboxRepository: OutboxRepository,
    private readonly emailService: EmailService,
    private readonly rabbitMqService: RabbitMqService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.rabbitMqService.consume<OutboxEmailJob>(
      OUTBOX_EMAIL_QUEUE,
      (job) => this.process(job),
    );
  }

  async process(job: OutboxEmailJob): Promise<void> {
    try {
      if (job.type !== OUTBOX_MESSAGE_TYPE.EMAIL) {
        throw new Error(`Unsupported outbox message type: ${job.type}`);
      }

      await this.emailService.sendEmail(job.payload);
      await this.outboxRepository.markSucceeded(job.id, job.workerId);
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : String(error);

      await this.outboxRepository.markFailed(
        job.id,
        job.workerId,
        job.attempts,
        messageText,
        OUTBOX_SETTINGS.MAX_ATTEMPTS,
        OUTBOX_SETTINGS.RETRY_DELAY_MS,
      );

      this.logger.error(
        `Outbox message ${job.id} failed on attempt ${job.attempts}: ${messageText}`,
      );
    }
  }
}

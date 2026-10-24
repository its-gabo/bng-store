import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, LessThanOrEqual, Repository } from 'typeorm';

import {
  OUTBOX_MESSAGE_STATUS,
  OUTBOX_MESSAGE_TYPE,
} from '../constants/outbox.constants';
import { OutboxMessageEntity } from '../db/outbox-message.entity';

import type { EmailMessage } from '../../email/email.types';
import type { OutboxEmailMessage } from '../types/outbox.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class OutboxRepository {
  constructor(
    @InjectRepository(OutboxMessageEntity)
    private readonly outboxMessages: Repository<OutboxMessageEntity>,
  ) {}

  async insertEmail(
    manager: EntityManager,
    email: EmailMessage,
  ): Promise<string> {
    const message = await manager.save(
      manager.create(OutboxMessageEntity, {
        type: OUTBOX_MESSAGE_TYPE.EMAIL,
        payload: email,
      }),
    );

    return message.id;
  }

  async claimBatch(
    workerId: string,
    batchSize: number,
    leaseMs: number,
  ): Promise<OutboxEmailMessage[]> {
    const now = new Date();
    const leaseExpiry = new Date(now.getTime() - leaseMs);

    return this.outboxMessages.manager.transaction(async (manager) => {
      const rows = await manager
        .createQueryBuilder(OutboxMessageEntity, 'message')
        .where('message.type = :type', { type: OUTBOX_MESSAGE_TYPE.EMAIL })
        .andWhere(
          new Brackets((query) => {
            query
              .where(
                'message.status = :pending AND message.availableAt <= :now',
                { pending: OUTBOX_MESSAGE_STATUS.PENDING, now },
              )
              .orWhere(
                'message.status = :processing AND message.lockedAt <= :leaseExpiry',
                { processing: OUTBOX_MESSAGE_STATUS.PROCESSING, leaseExpiry },
              );
          }),
        )
        .orderBy('message.createdAt', 'ASC')
        .limit(batchSize)
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .getMany();

      if (rows.length === 0) return [];

      await manager
        .createQueryBuilder()
        .update(OutboxMessageEntity)
        .set({
          status: OUTBOX_MESSAGE_STATUS.PROCESSING,
          attempts: () => 'attempts + 1',
          lockedAt: now,
          lockedBy: workerId,
          lastError: null,
        })
        .whereInIds(rows.map((row) => row.id))
        .execute();

      return rows.map((row) => ({
        id: row.id,
        type: row.type as typeof OUTBOX_MESSAGE_TYPE.EMAIL,
        payload: row.payload,
        status: OUTBOX_MESSAGE_STATUS.PROCESSING,
        attempts: row.attempts + 1,
        availableAt: row.availableAt,
        lockedAt: now,
        lockedBy: workerId,
        lastError: null,
        processedAt: row.processedAt,
        createdAt: row.createdAt,
      }));
    });
  }

  async markSucceeded(messageId: string, workerId: string): Promise<void> {
    await this.outboxMessages.update(
      {
        id: messageId,
        status: OUTBOX_MESSAGE_STATUS.PROCESSING,
        lockedBy: workerId,
      },
      {
        status: OUTBOX_MESSAGE_STATUS.SUCCEEDED,
        lockedAt: null,
        lockedBy: null,
        processedAt: new Date(),
      },
    );
  }

  async markFailed(
    messageId: string,
    workerId: string,
    attempts: number,
    error: string,
    maxAttempts: number,
    retryDelayMs: number,
  ): Promise<void> {
    const terminal = attempts >= maxAttempts;
    const availableAt = new Date(
      Date.now() + retryDelayMs * 2 ** Math.max(0, attempts - 1),
    );

    await this.outboxMessages.update(
      {
        id: messageId,
        status: OUTBOX_MESSAGE_STATUS.PROCESSING,
        lockedBy: workerId,
      },
      {
        status: terminal
          ? OUTBOX_MESSAGE_STATUS.FAILED
          : OUTBOX_MESSAGE_STATUS.PENDING,
        availableAt,
        lockedAt: null,
        lockedBy: null,
        lastError: error.slice(0, 4_000),
        processedAt: terminal ? new Date() : null,
      },
    );
  }

  async cleanupTerminalMessages(
    retentionMs: number,
    batchSize: number,
  ): Promise<number> {
    const processedBefore = new Date(Date.now() - retentionMs);

    return this.outboxMessages.manager.transaction(async (manager) => {
      const rows = await manager.find(OutboxMessageEntity, {
        select: { id: true },
        where: {
          status: In([
            OUTBOX_MESSAGE_STATUS.SUCCEEDED,
            OUTBOX_MESSAGE_STATUS.FAILED,
          ]),
          processedAt: LessThanOrEqual(processedBefore),
        },
        order: { processedAt: 'ASC' },
        take: batchSize,
        lock: { mode: 'pessimistic_write', onLocked: 'skip_locked' },
      });

      if (rows.length === 0) return 0;

      await manager.delete(
        OutboxMessageEntity,
        rows.map((row) => row.id),
      );

      return rows.length;
    });
  }
}

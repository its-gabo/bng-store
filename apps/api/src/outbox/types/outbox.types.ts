import type {
  OUTBOX_MESSAGE_STATUS,
  OUTBOX_MESSAGE_TYPE,
} from '../constants/outbox.constants';

import type { EmailMessage } from '../../email/email.types';

export type OutboxMessageType =
  (typeof OUTBOX_MESSAGE_TYPE)[keyof typeof OUTBOX_MESSAGE_TYPE];

export type OutboxMessageStatus =
  (typeof OUTBOX_MESSAGE_STATUS)[keyof typeof OUTBOX_MESSAGE_STATUS];

export type OutboxMessagePayload = EmailMessage;

export type OutboxEmailMessage = {
  id: string;
  type: typeof OUTBOX_MESSAGE_TYPE.EMAIL;
  payload: OutboxMessagePayload;
  status: OutboxMessageStatus;
  attempts: number;
  availableAt: Date;
  lockedAt: Date | null;
  lockedBy: string | null;
  lastError: string | null;
  processedAt: Date | null;
  createdAt: Date;
};

export type OutboxEmailJob = Pick<
  OutboxEmailMessage,
  'id' | 'type' | 'payload' | 'attempts'
> & {
  workerId: string;
};

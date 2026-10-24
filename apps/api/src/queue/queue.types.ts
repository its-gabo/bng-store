import type { ConsumeMessage } from 'amqplib';

export type RabbitMqMessageHandler<TPayload> = (
  payload: TPayload,
  message: ConsumeMessage,
) => Promise<void>;

export type RabbitMqConsumer = {
  queue: string;
  handler: RabbitMqMessageHandler<unknown>;
};

export type RabbitMqPublishOptions = {
  messageId?: string;
  type?: string;
};

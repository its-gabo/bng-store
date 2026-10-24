import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';

import { RABBITMQ_PREFETCH, RABBITMQ_RECOVERY } from './queue.constants';

import type {
  RabbitMqConsumer,
  RabbitMqMessageHandler,
  RabbitMqPublishOptions,
} from './queue.types';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type {
  ChannelModel,
  ConfirmChannel,
  ConsumeMessage,
  RecoveringChannelModel,
} from 'amqplib';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);
  private readonly url: string;
  private readonly consumers: RabbitMqConsumer[] = [];
  private connection: RecoveringChannelModel | null = null;
  private model: ChannelModel | null = null;
  private publishChannel: ConfirmChannel | null = null;

  constructor(configService: ConfigService) {
    this.url = configService.getOrThrow<string>('queue.RABBITMQ_URL');
  }

  async onModuleInit(): Promise<void> {
    this.connection = await connect(this.url, {
      recovery: {
        initialDelay: RABBITMQ_RECOVERY.INITIAL_DELAY_MS,
        maxDelay: RABBITMQ_RECOVERY.MAX_DELAY_MS,
        initialMaxRetries: RABBITMQ_RECOVERY.INITIAL_MAX_RETRIES,
        maxRetries: Infinity,
        setup: (model: ChannelModel) => this.setup(model),
      },
    });

    this.connection.on('disconnect', (error: Error) => {
      this.model = null;
      this.publishChannel = null;
      this.logger.warn(`RabbitMQ disconnected: ${error.message}`);
    });
    this.connection.on('error', (error: Error) => {
      this.logger.error(`RabbitMQ error: ${error.message}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
  }

  async publish(
    queue: string,
    payload: unknown,
    options: RabbitMqPublishOptions = {},
  ): Promise<void> {
    const channel = this.publishChannel;

    if (!channel) {
      throw new Error('[RABBITMQ] Not connected');
    }

    await channel.assertQueue(queue, { durable: true });

    await new Promise<void>((resolve, reject) => {
      channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(payload)),
        {
          ...options,
          persistent: true,
          contentType: 'application/json',
        },
        (error) => (error ? reject(error) : resolve()),
      );
    });
  }

  async consume<TPayload>(
    queue: string,
    handler: RabbitMqMessageHandler<TPayload>,
  ): Promise<void> {
    const consumer: RabbitMqConsumer = {
      queue,
      handler: handler as RabbitMqMessageHandler<unknown>,
    };

    this.consumers.push(consumer);

    if (this.model) await this.startConsumer(this.model, consumer);
  }

  private async setup(model: ChannelModel): Promise<void> {
    this.model = model;
    this.publishChannel = await model.createConfirmChannel();

    await Promise.all(
      this.consumers.map((consumer) => this.startConsumer(model, consumer)),
    );

    this.logger.log('RabbitMQ connected');
  }

  private async startConsumer(
    model: ChannelModel,
    consumer: RabbitMqConsumer,
  ): Promise<void> {
    const { queue, handler } = consumer;
    const channel = await model.createChannel();

    await channel.assertQueue(queue, { durable: true });
    await channel.prefetch(RABBITMQ_PREFETCH);

    await channel.consume(queue, (message: ConsumeMessage | null) => {
      if (!message) return;

      void (async () => {
        try {
          const payload: unknown = JSON.parse(message.content.toString());

          await handler(payload, message);
          channel.ack(message);
        } catch (error) {
          this.logger.error(
            `Failed to handle message from ${queue}: ${error instanceof Error ? error.message : String(error)}`,
          );
          channel.nack(message, false, false);
        }
      })();
    });
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutboxMessageEntity } from './db/outbox-message.entity';
import { OutboxRepository } from './repository/outbox.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OutboxMessageEntity])],
  providers: [OutboxRepository],
  exports: [OutboxRepository],
})
export class OutboxModule {}

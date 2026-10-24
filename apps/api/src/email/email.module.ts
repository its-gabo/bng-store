import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LocalAdapter } from './adapters/local.adapter';
import { EmailAdapter } from './email.adapter';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, { provide: EmailAdapter, useClass: LocalAdapter }],
  exports: [EmailService],
})
export class EmailModule {}

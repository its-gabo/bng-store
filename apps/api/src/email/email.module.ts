import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailAdapter } from './adapters/email.adapter';
import { LocalAdapter } from './adapters/local.adapter';
import { EmailService } from './services/email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, { provide: EmailAdapter, useClass: LocalAdapter }],
  exports: [EmailService],
})
export class EmailModule {}

import { Injectable } from '@nestjs/common';

import { EmailAdapter } from './email.adapter';

import type { EmailMessage } from './email.types';

@Injectable()
export class EmailService {
  constructor(private readonly emailAdapter: EmailAdapter) {}

  async sendEmail(email: EmailMessage): Promise<void> {
    await this.emailAdapter.sendMail(email);
  }
}

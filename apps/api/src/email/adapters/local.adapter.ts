import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

import { EmailAdapter } from '../email.adapter';

import type { EmailMessage } from '../email.types';

@Injectable()
export class LocalAdapter extends EmailAdapter {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    super();
    const config = this.getNodemailerOptions();
    this.transporter = nodemailer.createTransport(config);
  }

  private getNodemailerOptions() {
    const host = this.configService.getOrThrow<string>('email.SMTP_HOST');
    const port = this.configService.getOrThrow<number>('email.SMTP_PORT');

    return {
      host,
      port,
      secure: false,
      ignoreTLS: true,
    };
  }

  async sendMail(email: EmailMessage): Promise<void> {
    await this.transporter.sendMail(email);
  }
}

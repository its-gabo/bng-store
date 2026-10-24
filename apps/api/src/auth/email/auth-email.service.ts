import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ResetPasswordEmail,
  WelcomeVerifyEmail,
} from '@workspace/email-templates';

import { AUTH_EMAIL_SUBJECTS } from './auth-email.constants';

import type { AuthEmailPayloads } from './auth-email.types';
import type { EmailMessage } from '../../email/email.types';

@Injectable()
export class AuthEmailService {
  private readonly emailFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.emailFrom = this.configService.getOrThrow<string>('email.EMAIL_FROM');
  }

  async renderWelcomeVerifyEmail(
    payload: AuthEmailPayloads['SEND_WELCOME_VERIFY_EMAIL'],
  ): Promise<EmailMessage> {
    const template = new WelcomeVerifyEmail({
      name: payload.name,
      email: payload.email,
      verificationUrl: payload.verificationUrl,
    });
    const [html, text] = await Promise.all([
      template.getHtml(),
      template.getText(),
    ]);

    return this.renderEmail(
      payload.email,
      AUTH_EMAIL_SUBJECTS.WELCOME_VERIFY,
      html,
      text,
    );
  }

  async renderResetPasswordEmail(
    payload: AuthEmailPayloads['SEND_RESET_PASSWORD_EMAIL'],
  ): Promise<EmailMessage> {
    const template = new ResetPasswordEmail({
      name: payload.name,
      resetUrl: payload.resetUrl,
    });
    const [html, text] = await Promise.all([
      template.getHtml(),
      template.getText(),
    ]);

    return this.renderEmail(
      payload.email,
      AUTH_EMAIL_SUBJECTS.RESET_PASSWORD,
      html,
      text,
    );
  }

  private async renderEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
  ): Promise<EmailMessage> {
    return {
      from: this.emailFrom,
      to,
      subject,
      html,
      text,
    };
  }
}

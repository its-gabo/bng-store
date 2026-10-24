import type { EmailMessage } from '../types/email.types';

export abstract class EmailAdapter {
  abstract sendMail(email: EmailMessage): Promise<void>;
}

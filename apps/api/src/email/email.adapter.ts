import type { EmailMessage } from './email.types';

export abstract class EmailAdapter {
  abstract sendMail(email: EmailMessage): Promise<void>;
}

import { CredentialEntity } from '../auth/db/credential.entity';
import { EmailVerificationTokenEntity } from '../auth/db/email-verification-token.entity';
import { PasswordResetTokenEntity } from '../auth/db/password-reset-token.entity';
import { SessionEntity } from '../auth/db/session.entity';
import { OutboxMessageEntity } from '../outbox/db/outbox-message.entity';
import { UserEntity } from '../users/db/user.entity';

export const DB_ENTITIES = [
  UserEntity,
  CredentialEntity,
  SessionEntity,
  EmailVerificationTokenEntity,
  PasswordResetTokenEntity,
  OutboxMessageEntity,
];

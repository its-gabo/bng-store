import { CredentialEntity } from '../auth/db/credential.entity';
import { EmailVerificationTokenEntity } from '../auth/db/email-verification-token.entity';
import { PasswordResetTokenEntity } from '../auth/db/password-reset-token.entity';
import { SessionEntity } from '../auth/db/session.entity';
import { OutboxMessageEntity } from '../outbox/db/outbox-message.entity';
import { ApplicationPriceEntity } from '../store/db/application-price.entity';
import { ApplicationEntity } from '../store/db/application.entity';
import { BundleApplicationEntity } from '../store/db/bundle-application.entity';
import { BundlePriceEntity } from '../store/db/bundle-price.entity';
import { BundleEntity } from '../store/db/bundle.entity';
import { LicenseKeyEntity } from '../store/db/license-key.entity';
import { OrderItemEntity } from '../store/db/order-item.entity';
import { OrderEntity } from '../store/db/order.entity';
import { SubscriptionApplicationEntity } from '../store/db/subscription-application.entity';
import { SubscriptionEntity } from '../store/db/subscription.entity';
import { UserEntity } from '../users/db/user.entity';

export const DB_ENTITIES = [
  UserEntity,
  CredentialEntity,
  SessionEntity,
  EmailVerificationTokenEntity,
  PasswordResetTokenEntity,
  OutboxMessageEntity,
  ApplicationEntity,
  ApplicationPriceEntity,
  BundleEntity,
  BundleApplicationEntity,
  BundlePriceEntity,
  OrderEntity,
  OrderItemEntity,
  SubscriptionEntity,
  SubscriptionApplicationEntity,
  LicenseKeyEntity,
];

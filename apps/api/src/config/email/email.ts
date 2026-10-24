import { registerAs } from '@nestjs/config';

import { configValidator } from '../config.validator';

import { emailSchema } from './email.schema';

import type { EmailConfigSchema } from './email.types';

const validateEmailConfig = configValidator(emailSchema);

export default registerAs('email', (): EmailConfigSchema => {
  const values = {
    EMAIL_FROM: process.env.EMAIL_FROM ?? 'no-reply@bng-store.local',
    SMTP_HOST: process.env.SMTP_HOST ?? 'localhost',
    SMTP_PORT: Number.parseInt(process.env.SMTP_PORT ?? '1025', 10),
  };

  return validateEmailConfig(values);
});

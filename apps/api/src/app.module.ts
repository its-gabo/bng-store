import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import authConfig from './config/auth/auth';
import databaseConfig from './config/db/database';
import emailConfig from './config/email/email';
import { DbModule } from './db/db.module';
import { OutboxModule } from './outbox/outbox.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      load: [databaseConfig, emailConfig, authConfig],
    }),
    DbModule,
    OutboxModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

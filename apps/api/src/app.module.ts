import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { ApiExceptionFilter } from './common/http/errors/api-exception.filter';
import databaseConfig from './config/db/database';
import emailConfig from './config/email/email';
import { DbModule } from './db/db.module';
import { OutboxModule } from './outbox/outbox.module';
import { StoreHttpModule } from './store/store-http.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      load: [databaseConfig, emailConfig],
    }),
    DbModule,
    OutboxModule,
    UsersModule,
    AuthModule,
    StoreHttpModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: ApiExceptionFilter }],
})
export class AppModule {}

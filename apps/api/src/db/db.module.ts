import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { createDataSourceOptions } from './db.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDataSourceOptions(
          configService.getOrThrow<string>('database.DATABASE_URL'),
        ),
    }),
  ],
})
export class DbModule {}

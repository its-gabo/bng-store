import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './db/user.entity';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

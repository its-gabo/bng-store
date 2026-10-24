import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../repository/users.repository';

import type { UserEntity } from '../db/user.entity';
import type { CreateUserInput } from '../types/users.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  async createUser(
    input: CreateUserInput,
    manager?: EntityManager,
  ): Promise<UserEntity> {
    return this.usersRepository.create(input, manager);
  }

  async markEmailVerified(
    userId: string,
    manager?: EntityManager,
  ): Promise<void> {
    await this.usersRepository.markEmailVerified(userId, manager);
  }
}

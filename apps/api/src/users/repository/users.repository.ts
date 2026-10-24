import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../db/user.entity';

import type { CreateUserInput } from '../types/users.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.findOneBy({ email });
  }

  async create(
    input: CreateUserInput,
    manager: EntityManager = this.users.manager,
  ): Promise<UserEntity> {
    return manager.save(
      manager.create(UserEntity, {
        email: input.email,
        name: input.name,
      }),
    );
  }

  async markEmailVerified(
    userId: string,
    manager: EntityManager = this.users.manager,
  ): Promise<void> {
    await manager.update(UserEntity, { id: userId }, { emailVerified: true });
  }
}

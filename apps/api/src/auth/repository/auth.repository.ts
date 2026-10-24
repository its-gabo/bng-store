import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull } from 'typeorm';

import { OutboxRepository } from '../../outbox/repository/outbox.repository';
import { UserEntity } from '../../users/db/user.entity';
import { CredentialEntity } from '../db/credential.entity';
import { EmailVerificationTokenEntity } from '../db/email-verification-token.entity';
import { PasswordResetTokenEntity } from '../db/password-reset-token.entity';
import { SessionEntity } from '../db/session.entity';

import type {
  AuthSessionRecord,
  AuthTokenRecord,
  CreatePasswordResetTokenParams,
  CreateSessionParams,
  CreateUserCredentialAndVerificationTokenParams,
} from '../types/auth.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async transaction<T>(
    work: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(work);
  }

  async findCredentialByUserId(
    userId: string,
  ): Promise<CredentialEntity | null> {
    return this.dataSource.manager.findOneBy(CredentialEntity, { userId });
  }

  async createUserCredentialAndVerificationToken(
    params: CreateUserCredentialAndVerificationTokenParams,
  ): Promise<{ userId: string }> {
    const {
      email,
      name,
      passwordHash,
      verificationTokenHash,
      verificationTokenExpiresAt,
      welcomeEmail,
    } = params;

    return this.dataSource.transaction(async (manager) => {
      const createdUser = await manager.save(
        manager.create(UserEntity, { email, name }),
      );

      await manager.insert(CredentialEntity, {
        userId: createdUser.id,
        passwordHash,
      });

      await manager.insert(EmailVerificationTokenEntity, {
        userId: createdUser.id,
        tokenHash: verificationTokenHash,
        expiresAt: verificationTokenExpiresAt,
      });

      await this.outboxRepository.insertEmail(manager, welcomeEmail);

      return { userId: createdUser.id };
    });
  }

  async updateCredentialPasswordHash(
    params: { userId: string; passwordHash: string },
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    const { userId, passwordHash } = params;

    await manager.update(CredentialEntity, { userId }, { passwordHash });
  }

  async createSession(params: CreateSessionParams): Promise<void> {
    const { userId, tokenHash, expiresAt, ipAddress, userAgent } = params;

    await this.dataSource.manager.insert(SessionEntity, {
      userId,
      tokenHash,
      expiresAt,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });
  }

  async findSessionByTokenHash(
    tokenHash: string,
  ): Promise<AuthSessionRecord | null> {
    const session = await this.dataSource.manager.findOne(SessionEntity, {
      where: { tokenHash },
      relations: { user: true },
    });

    if (!session?.user) return null;

    const { userId, expiresAt, user } = session;

    return {
      userId,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      expiresAt,
    };
  }

  async deleteSessionByTokenHash(tokenHash: string): Promise<void> {
    await this.dataSource.manager.delete(SessionEntity, { tokenHash });
  }

  async deleteSessionsByUserId(
    userId: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(SessionEntity, { userId });
  }

  async consumeEmailVerificationToken(
    tokenHash: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<AuthTokenRecord | null> {
    return this.consumeToken(EmailVerificationTokenEntity, tokenHash, manager);
  }

  async createPasswordResetToken(
    params: CreatePasswordResetTokenParams,
  ): Promise<void> {
    const { userId, tokenHash, expiresAt, resetEmail } = params;

    await this.dataSource.transaction(async (manager) => {
      await manager.insert(PasswordResetTokenEntity, {
        userId,
        tokenHash,
        expiresAt,
      });

      await this.outboxRepository.insertEmail(manager, resetEmail);
    });
  }

  async consumePasswordResetToken(
    tokenHash: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<AuthTokenRecord | null> {
    return this.consumeToken(PasswordResetTokenEntity, tokenHash, manager);
  }

  private async consumeToken(
    entity:
      typeof EmailVerificationTokenEntity | typeof PasswordResetTokenEntity,
    tokenHash: string,
    manager: EntityManager,
  ): Promise<AuthTokenRecord | null> {
    const now = new Date();

    const result = await manager
      .createQueryBuilder()
      .update(entity)
      .set({ consumedAt: now })
      .where({ tokenHash, consumedAt: IsNull() })
      .andWhere('expires_at > :now', { now })
      .returning(['userId'])
      .execute();

    const [row] = result.raw as { user_id: string }[];

    if (!row) return null;

    return { userId: row.user_id };
  }
}

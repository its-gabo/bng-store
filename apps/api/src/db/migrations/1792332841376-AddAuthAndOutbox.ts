import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthAndOutbox1792332841376 implements MigrationInterface {
  name = 'AddAuthAndOutbox1792332841376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "email" text NOT NULL,
                "name" text NOT NULL,
                "email_verified" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "credentials" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "password_hash" text NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "REL_c68a6c53e95a7dc357f4ebce8f" UNIQUE ("user_id"),
                CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "email_verification_tokens" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "token_hash" text NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "consumed_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_c20ed35f3d31d486aabcd0564da" UNIQUE ("token_hash"),
                CONSTRAINT "PK_417a095bbed21c2369a6a01ab9a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens" ("user_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "password_reset_tokens" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "token_hash" text NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "consumed_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_91185d86d5d7557b19abbb2868b" UNIQUE ("token_hash"),
                CONSTRAINT "PK_d16bebd73e844c48bca50ff8d3d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens" ("user_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "token_hash" text NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "ip_address" text,
                "user_agent" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_abaa9e068cdd390bc5210f79884" UNIQUE ("token_hash"),
                CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "sessions_user_id_idx" ON "sessions" ("user_id")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."outbox_message_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED')
        `);
    await queryRunner.query(`
            CREATE TABLE "outbox_messages" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "type" text NOT NULL DEFAULT 'email',
                "payload" jsonb NOT NULL,
                "status" "public"."outbox_message_status" NOT NULL DEFAULT 'PENDING',
                "attempts" integer NOT NULL DEFAULT '0',
                "available_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "locked_at" TIMESTAMP WITH TIME ZONE,
                "locked_by" text,
                "last_error" text,
                "processed_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0171348f527c64b137e4d4f5b66" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "outbox_messages_locked_at_idx" ON "outbox_messages" ("status", "locked_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "outbox_messages_claim_idx" ON "outbox_messages" ("status", "available_at", "created_at")
        `);
    await queryRunner.query(`
            ALTER TABLE "credentials"
            ADD CONSTRAINT "FK_c68a6c53e95a7dc357f4ebce8f0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "email_verification_tokens"
            ADD CONSTRAINT "FK_fdcb77f72f529bf65c95d72a147" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "password_reset_tokens"
            ADD CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"
        `);
    await queryRunner.query(`
            ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c"
        `);
    await queryRunner.query(`
            ALTER TABLE "email_verification_tokens" DROP CONSTRAINT "FK_fdcb77f72f529bf65c95d72a147"
        `);
    await queryRunner.query(`
            ALTER TABLE "credentials" DROP CONSTRAINT "FK_c68a6c53e95a7dc357f4ebce8f0"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."outbox_messages_claim_idx"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."outbox_messages_locked_at_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "outbox_messages"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."outbox_message_status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."sessions_user_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."password_reset_tokens_user_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "password_reset_tokens"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."email_verification_tokens_user_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "email_verification_tokens"
        `);
    await queryRunner.query(`
            DROP TABLE "credentials"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}

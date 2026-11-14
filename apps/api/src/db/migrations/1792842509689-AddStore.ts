import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStore1792842509689 implements MigrationInterface {
  name = 'AddStore1792842509689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "applications" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "slug" text NOT NULL,
                "name" text NOT NULL,
                "description" text NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_7482543b92c5b8b51b988f890e5" UNIQUE ("slug"),
                CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."application_price_billing_period" AS ENUM('monthly', 'yearly')
        `);
    await queryRunner.query(`
            CREATE TABLE "application_prices" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "application_id" uuid NOT NULL,
                "billing_period" "public"."application_price_billing_period" NOT NULL,
                "amount_minor" integer NOT NULL,
                "currency" character(3) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "application_prices_application_period_currency_key" UNIQUE ("application_id", "billing_period", "currency"),
                CONSTRAINT "application_prices_amount_minor_check" CHECK ("amount_minor" >= 0),
                CONSTRAINT "PK_e71251779151f8cfd79c918b23b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."bundle_price_billing_period" AS ENUM('monthly', 'yearly')
        `);
    await queryRunner.query(`
            CREATE TABLE "bundle_prices" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "bundle_id" uuid NOT NULL,
                "billing_period" "public"."bundle_price_billing_period" NOT NULL,
                "amount_minor" integer NOT NULL,
                "currency" character(3) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "bundle_prices_bundle_period_currency_key" UNIQUE ("bundle_id", "billing_period", "currency"),
                CONSTRAINT "bundle_prices_amount_minor_check" CHECK ("amount_minor" >= 0),
                CONSTRAINT "PK_cfcda51a3a1f2a46c3d2726a266" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "bundles" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "slug" text NOT NULL,
                "name" text NOT NULL,
                "description" text NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "sort_order" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_7da4ed9b523bde1ca02ff412250" UNIQUE ("slug"),
                CONSTRAINT "PK_a9118b2e4597aede4d5d4c43433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "bundle_applications" (
                "bundle_id" uuid NOT NULL,
                "application_id" uuid NOT NULL,
                CONSTRAINT "PK_3174f27312698d0826c360f9cf2" PRIMARY KEY ("bundle_id", "application_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "bundle_applications_application_id_idx" ON "bundle_applications" ("application_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "order_id" uuid NOT NULL,
                "application_id" uuid NOT NULL,
                "unit_amount_minor" integer,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "order_items_order_application_key" UNIQUE ("order_id", "application_id"),
                CONSTRAINT "order_items_unit_amount_minor_check" CHECK (
                    "unit_amount_minor" IS NULL
                    OR "unit_amount_minor" >= 0
                ),
                CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "order_items_application_id_idx" ON "order_items" ("application_id")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."order_kind" AS ENUM('purchase', 'adjustment', 'renewal')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."order_selection" AS ENUM('bundle', 'custom')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."order_billing_period" AS ENUM('monthly', 'yearly')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."order_status" AS ENUM(
                'pending',
                'paid',
                'failed',
                'cancelled',
                'expired'
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."payment_provider" AS ENUM('mock')
        `);
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "kind" "public"."order_kind" NOT NULL,
                "selection" "public"."order_selection" NOT NULL,
                "bundle_id" uuid,
                "subscription_id" uuid,
                "billing_period" "public"."order_billing_period" NOT NULL,
                "status" "public"."order_status" NOT NULL DEFAULT 'pending',
                "total_amount_minor" integer NOT NULL,
                "currency" character(3) NOT NULL,
                "payment_provider" "public"."payment_provider" NOT NULL,
                "payment_reference" text,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "paid_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_0fd0d909c78f8efa1fb47d0c91c" UNIQUE ("payment_reference"),
                CONSTRAINT "orders_total_amount_minor_check" CHECK ("total_amount_minor" >= 0),
                CONSTRAINT "orders_subscription_kind_check" CHECK (
                    ("kind" = 'purchase') = ("subscription_id" IS NULL)
                ),
                CONSTRAINT "orders_bundle_selection_check" CHECK (
                    ("selection" = 'bundle') = ("bundle_id" IS NOT NULL)
                ),
                CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "orders_user_id_idx" ON "orders" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "orders_subscription_id_idx" ON "orders" ("subscription_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "orders_status_expires_at_idx" ON "orders" ("status", "expires_at")
        `);
    await queryRunner.query(`
            CREATE TABLE "subscription_applications" (
                "subscription_id" uuid NOT NULL,
                "application_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_c27290d7efe72c677d14e474b79" PRIMARY KEY ("subscription_id", "application_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "subscription_applications_application_id_idx" ON "subscription_applications" ("application_id")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."subscription_billing_period" AS ENUM('monthly', 'yearly')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired')
        `);
    await queryRunner.query(`
            CREATE TABLE "subscriptions" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "order_id" uuid NOT NULL,
                "bundle_id" uuid,
                "billing_period" "public"."subscription_billing_period" NOT NULL,
                "status" "public"."subscription_status" NOT NULL DEFAULT 'active',
                "current_period_start" TIMESTAMP WITH TIME ZONE NOT NULL,
                "current_period_end" TIMESTAMP WITH TIME ZONE NOT NULL,
                "cancel_at_period_end" boolean NOT NULL DEFAULT false,
                "cancelled_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_6bdf99a2aee06482f33465a70e1" UNIQUE ("order_id"),
                CONSTRAINT "REL_6bdf99a2aee06482f33465a70e" UNIQUE ("order_id"),
                CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "subscriptions_status_current_period_end_idx" ON "subscriptions" ("status", "current_period_end")
        `);
    await queryRunner.query(`
            CREATE TABLE "license_keys" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "subscription_id" uuid NOT NULL,
                "key_hash" text NOT NULL,
                "key_hint" text NOT NULL,
                "revoked_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_254fb75b27bb2b9fdae2198d3e6" UNIQUE ("subscription_id"),
                CONSTRAINT "UQ_ff6435b8eeee096f5c1c2169710" UNIQUE ("key_hash"),
                CONSTRAINT "REL_254fb75b27bb2b9fdae2198d3e" UNIQUE ("subscription_id"),
                CONSTRAINT "PK_b2711aaaf68d41a34461591519f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "application_prices"
            ADD CONSTRAINT "FK_34c32d95dff04ced5b05e2442cd" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "bundle_prices"
            ADD CONSTRAINT "FK_83eda673382c5e9e299b19537cb" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "bundle_applications"
            ADD CONSTRAINT "FK_5d4d1833a949845c662e79544de" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "bundle_applications"
            ADD CONSTRAINT "FK_b48b76c2a35cbf236e1e0547383" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "FK_213440e5c4117ee0999fc5e9266" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_8424432d74a32892161838c9a27" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_a99c67e713ffa08f499b2c79d57" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "subscription_applications"
            ADD CONSTRAINT "FK_9bae64b222aeee54241159981ba" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "subscription_applications"
            ADD CONSTRAINT "FK_fce39af633bdc6e0847eda8cf23" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD CONSTRAINT "FK_6bdf99a2aee06482f33465a70e1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD CONSTRAINT "FK_e6b4efdd5ec878d445c03ef370f" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "license_keys"
            ADD CONSTRAINT "FK_254fb75b27bb2b9fdae2198d3e6" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "license_keys" DROP CONSTRAINT "FK_254fb75b27bb2b9fdae2198d3e6"
        `);
    await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_e6b4efdd5ec878d445c03ef370f"
        `);
    await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_6bdf99a2aee06482f33465a70e1"
        `);
    await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"
        `);
    await queryRunner.query(`
            ALTER TABLE "subscription_applications" DROP CONSTRAINT "FK_fce39af633bdc6e0847eda8cf23"
        `);
    await queryRunner.query(`
            ALTER TABLE "subscription_applications" DROP CONSTRAINT "FK_9bae64b222aeee54241159981ba"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_a99c67e713ffa08f499b2c79d57"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_8424432d74a32892161838c9a27"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "FK_213440e5c4117ee0999fc5e9266"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"
        `);
    await queryRunner.query(`
            ALTER TABLE "bundle_applications" DROP CONSTRAINT "FK_b48b76c2a35cbf236e1e0547383"
        `);
    await queryRunner.query(`
            ALTER TABLE "bundle_applications" DROP CONSTRAINT "FK_5d4d1833a949845c662e79544de"
        `);
    await queryRunner.query(`
            ALTER TABLE "bundle_prices" DROP CONSTRAINT "FK_83eda673382c5e9e299b19537cb"
        `);
    await queryRunner.query(`
            ALTER TABLE "application_prices" DROP CONSTRAINT "FK_34c32d95dff04ced5b05e2442cd"
        `);
    await queryRunner.query(`
            DROP TABLE "license_keys"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."subscriptions_status_current_period_end_idx"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."subscriptions_user_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "subscriptions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."subscription_status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."subscription_billing_period"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."subscription_applications_application_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "subscription_applications"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."orders_status_expires_at_idx"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."orders_subscription_id_idx"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."orders_user_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."payment_provider"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."order_status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."order_billing_period"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."order_selection"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."order_kind"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."order_items_application_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "order_items"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."bundle_applications_application_id_idx"
        `);
    await queryRunner.query(`
            DROP TABLE "bundle_applications"
        `);
    await queryRunner.query(`
            DROP TABLE "bundles"
        `);
    await queryRunner.query(`
            DROP TABLE "bundle_prices"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."bundle_price_billing_period"
        `);
    await queryRunner.query(`
            DROP TABLE "application_prices"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."application_price_billing_period"
        `);
    await queryRunner.query(`
            DROP TABLE "applications"
        `);
  }
}

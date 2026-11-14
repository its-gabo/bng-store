import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignLicenseKeyToUser1794653395560 implements MigrationInterface {
  name = 'AssignLicenseKeyToUser1794653395560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "license_keys" DROP CONSTRAINT "FK_254fb75b27bb2b9fdae2198d3e6"
        `);
    await queryRunner.query(`
            ALTER TABLE "license_keys"
                RENAME COLUMN "subscription_id" TO "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "license_keys"
                RENAME CONSTRAINT "UQ_254fb75b27bb2b9fdae2198d3e6" TO "UQ_aa5107d219ff93814a37b920441"
        `);
    await queryRunner.query(`
            ALTER TABLE "license_keys"
            ADD CONSTRAINT "FK_aa5107d219ff93814a37b920441" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "license_keys" DROP CONSTRAINT "FK_aa5107d219ff93814a37b920441"
        `);
    await queryRunner.query(`
            ALTER TABLE "license_keys"
                RENAME CONSTRAINT "UQ_aa5107d219ff93814a37b920441" TO "UQ_254fb75b27bb2b9fdae2198d3e6"
        `);
    await queryRunner.query(`
            ALTER TABLE "license_keys"
                RENAME COLUMN "user_id" TO "subscription_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "license_keys"
            ADD CONSTRAINT "FK_254fb75b27bb2b9fdae2198d3e6" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745587580694 implements MigrationInterface {
    name = 'Migration1745587580694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "account_orm_entity" SET "balance" = 0 WHERE "balance" IS NULL`);
        await queryRunner.query(`ALTER TABLE "account_orm_entity" ALTER COLUMN "balance" TYPE numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_orm_entity" ALTER COLUMN "balance" TYPE double precision`);
    }

}

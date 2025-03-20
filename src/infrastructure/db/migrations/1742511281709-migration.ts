import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742511281709 implements MigrationInterface {
    name = 'Migration1742511281709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_orm_entity" ADD "role" character varying NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_orm_entity" DROP COLUMN "role"`);
    }

}

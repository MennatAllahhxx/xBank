import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751108897580 implements MigrationInterface {
    name = 'Migration1751108897580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" DROP COLUMN "payment_intent_id"`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" ADD "payment_intent_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" DROP COLUMN "payment_intent_id"`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" ADD "payment_intent_id" character varying`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745595531147 implements MigrationInterface {
    name = 'Migration1745595531147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_orm_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sender_account_id" uuid NOT NULL, "receiver_account_id" uuid NOT NULL, "amount" numeric(10,2) NOT NULL, CONSTRAINT "PK_e1995d5930ff7c4758e1abe875d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" ADD CONSTRAINT "FK_8f123a3e86693451063e9e2abb5" FOREIGN KEY ("sender_account_id") REFERENCES "account_orm_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" ADD CONSTRAINT "FK_820297a94e920f928612ef4e0cc" FOREIGN KEY ("receiver_account_id") REFERENCES "account_orm_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" DROP CONSTRAINT "FK_820297a94e920f928612ef4e0cc"`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" DROP CONSTRAINT "FK_8f123a3e86693451063e9e2abb5"`);
        await queryRunner.query(`DROP TABLE "transaction_orm_entity"`);
    }

}

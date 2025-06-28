import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750459935805 implements MigrationInterface {
    name = 'Migration1750459935805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_orm_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_b055d7c61da7843046063d60b7d" UNIQUE ("email"), CONSTRAINT "PK_5fa555e23121a5c741ae858e469" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_orm_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "account_type" character varying(100) NOT NULL DEFAULT 'current', "balance" numeric(10,2) NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_ce9216a90d3cce9c96bd85aa63a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_orm_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "account_id" uuid NOT NULL, "amount" numeric(10,2) NOT NULL, "source" character varying NOT NULL DEFAULT 'internal', "status" character varying NOT NULL DEFAULT 'pending', "type" character varying NOT NULL DEFAULT 'transfer', "sender_account_id" uuid, "payment_intent_id" character varying, "receiver_account_id" uuid, CONSTRAINT "PK_e1995d5930ff7c4758e1abe875d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_orm_entity" ADD CONSTRAINT "FK_5b9afcd492098943ca70a8397ee" FOREIGN KEY ("user_id") REFERENCES "user_orm_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" ADD CONSTRAINT "FK_820297a94e920f928612ef4e0cc" FOREIGN KEY ("receiver_account_id") REFERENCES "account_orm_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" ADD CONSTRAINT "FK_8f123a3e86693451063e9e2abb5" FOREIGN KEY ("sender_account_id") REFERENCES "account_orm_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" DROP CONSTRAINT "FK_8f123a3e86693451063e9e2abb5"`);
        await queryRunner.query(`ALTER TABLE "transaction_orm_entity" DROP CONSTRAINT "FK_820297a94e920f928612ef4e0cc"`);
        await queryRunner.query(`ALTER TABLE "account_orm_entity" DROP CONSTRAINT "FK_5b9afcd492098943ca70a8397ee"`);
        await queryRunner.query(`DROP TABLE "transaction_orm_entity"`);
        await queryRunner.query(`DROP TABLE "account_orm_entity"`);
        await queryRunner.query(`DROP TABLE "user_orm_entity"`);
    }

}

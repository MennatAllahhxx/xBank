import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742828745073 implements MigrationInterface {
    name = 'Migration1742828745073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_orm_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "account_type" character varying(100) NOT NULL DEFAULT 'current' CHECK (account_type IN ('savings', 'current')), "balance" double precision NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_ce9216a90d3cce9c96bd85aa63a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_orm_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_b055d7c61da7843046063d60b7d" UNIQUE ("email"), CONSTRAINT "PK_5fa555e23121a5c741ae858e469" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_orm_entity" ADD CONSTRAINT "FK_account_user" FOREIGN KEY ("user_id") REFERENCES "user_orm_entity"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_orm_entity" DROP CONSTRAINT "FK_account_user"`);
        await queryRunner.query(`DROP TABLE "user_orm_entity"`);
        await queryRunner.query(`DROP TABLE "account_orm_entity"`);
    }

}

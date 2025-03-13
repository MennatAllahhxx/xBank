import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741873665788 implements MigrationInterface {
    name = 'Migration1741873665788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_orm_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_b055d7c61da7843046063d60b7d" UNIQUE ("email"), CONSTRAINT "PK_5fa555e23121a5c741ae858e469" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_orm_entity"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatewareHouse1742728554038 implements MigrationInterface {
    name = 'CreatewareHouse1742728554038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ware_house" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "capacity" integer NOT NULL, "currentOccupancy" integer NOT NULL DEFAULT '0', "contactPhone" character varying, "contactEmail" character varying, "createdById" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2cd58c197b5c9f327b43a38b838" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ware_house" ADD CONSTRAINT "FK_dade3bb01f90a11dd89af78afae" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ware_house" DROP CONSTRAINT "FK_dade3bb01f90a11dd89af78afae"`);
        await queryRunner.query(`DROP TABLE "ware_house"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1742041217319 implements MigrationInterface {
    name = 'UserTable1742041217319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}

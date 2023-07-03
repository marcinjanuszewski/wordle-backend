import { MigrationInterface, QueryRunner } from "typeorm";

export class GameGuess1688377214779 implements MigrationInterface {
    name = 'GameGuess1688377214779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_guess" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "guess" character varying NOT NULL, "gameId" uuid NOT NULL, CONSTRAINT "PK_45fda74437a75f149602d2224c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game_guess" ADD CONSTRAINT "FK_9ecfde139b9ced0aeec58b771c6" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_guess" DROP CONSTRAINT "FK_9ecfde139b9ced0aeec58b771c6"`);
        await queryRunner.query(`DROP TABLE "game_guess"`);
    }

}

import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryFailedError } from 'typeorm';

import { DatabaseModule } from '../../../src/core/database/database.module';
import { createConfigModule } from '../utils/config.util';
import UserEntity from '../../../src/core/database/entities/user.entity';
import { expectRejectedWith } from '../../utils/expect-rejected-with';
import { isUniqueConstraintError } from '../utils/db.helper';

describe('database', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, createConfigModule()],
    }).compile();

    await moduleRef.init();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('user repository', () => {
    it('should throw error when email is already taken', async () => {
      const dataSource = moduleRef.get<DataSource>(DataSource);

      const repo = dataSource.getRepository(UserEntity);

      await repo.save({
        email: 'janusztracz@wordle.api',
        passwordHash: 'somehash',
      });

      const savePromise = repo.save({
        email: 'janUsztRacz@wordle.api',
        passwordHash: 'somehash',
      });

      await expectRejectedWith(savePromise, QueryFailedError, (err) => {
        expect(isUniqueConstraintError(err, 'UK_USER_EMAIL')).toBeTruthy();
      });
    });
  });
});

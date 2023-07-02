import { Test, TestingModule } from '@nestjs/testing';

import { createConfigModule } from './utils/config.util';
import { clearDb, ensureDbMigrated } from './utils/db.helper';

import { DatabaseModule } from '../../src/core/database/database.module';

let moduleRef: TestingModule;

beforeAll(async () => {
  moduleRef = await Test.createTestingModule({
    imports: [DatabaseModule, createConfigModule()],
  }).compile();
  await moduleRef.init();

  await ensureDbMigrated(moduleRef);
});

beforeEach(async () => {
  await clearDb(moduleRef);
});

afterAll(async () => {
  await moduleRef.close();
});

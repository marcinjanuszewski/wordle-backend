import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../src/core/database/database.module';
import { createConfigModule } from './utils/config.util';
import { clearDb, ensureDbMigrated } from './utils/db.helper';

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

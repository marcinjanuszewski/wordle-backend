import { TestingModule } from '@nestjs/testing';

import { setupApp } from '../../../src/main';

const setupTestingApp = async (moduleFixture: TestingModule) => {
  let app = moduleFixture.createNestApplication();
  app = setupApp(app);

  return app.init();
};

export default { setupTestingApp };

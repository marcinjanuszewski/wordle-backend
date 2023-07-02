import { ConfigModule } from '@nestjs/config';

import defaultConfig from '../../../src/config/default.config';
import dbConfig from '../../../src/core/database/config/db.config';

export const createConfigModule = () =>
  ConfigModule.forRoot({
    load: [defaultConfig, dbConfig],
    isGlobal: true,
  });

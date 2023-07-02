import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import dbConfig from './config/db.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfig],
});

export default new DataSource(dbConfig());

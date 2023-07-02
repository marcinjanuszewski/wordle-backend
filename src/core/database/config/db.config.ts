import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

const createPostgresDbOptions = (
  env: Record<string, string>,
): DataSourceOptions => ({
  type: 'postgres',
  database: env.POSTGRES_DATABASE,
  host: env.POSTGRES_HOST,
  port: +env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/../**/migrations/*.{js,ts}`],
  migrationsRun: true,
  ssl: env.POSTGRES_SSL_CA_CERT
    ? {
        rejectUnauthorized: true,
        ca: env.POSTGRES_SSL_CA_CERT,
      }
    : false,
  synchronize: false,
  logging: false,
});

export default registerAs('db', () => createPostgresDbOptions(process.env));

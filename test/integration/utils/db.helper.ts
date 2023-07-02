import { TestingModule } from '@nestjs/testing';
import { DataSource, QueryFailedError } from 'typeorm';

export const clearDb = async (moduleRef: TestingModule) => {
  const dataSource = moduleRef.get<DataSource>(DataSource);
  const entities = dataSource.entityMetadatas;

  const commands = entities.map(
    (e) => `
      ALTER TABLE "${e.tableName}" DISABLE TRIGGER ALL;
      TRUNCATE table "${e.tableName}" CASCADE; 
      ALTER TABLE "${e.tableName}" ENABLE TRIGGER ALL;`,
  );

  await dataSource.transaction(async (em) => {
    await Promise.all(commands.map((c) => em.query(c)));
  });
};

export const ensureDbMigrated = async (moduleRef: TestingModule) => {
  const dataSource = moduleRef.get<DataSource>(DataSource);
  await dataSource.runMigrations();
};

const isErrorWithCode = (error: QueryFailedError, code: string) => {
  return (
    error.driverError &&
    error.driverError.severity === 'ERROR' &&
    error.driverError.code === code
  );
};

export const isUniqueConstraintError = (
  error: QueryFailedError,
  constraintName?: string,
) => {
  const isUniqueError = isErrorWithCode(error, '23505');
  if (!isUniqueError) {
    return false;
  }

  return !constraintName || constraintName === error.driverError.constraint;
};

export const isCheckConstraintError = (
  error: QueryFailedError,
  constraintName: string,
) => {
  return (
    isErrorWithCode(error, '23514') &&
    error.driverError.constraint === constraintName
  );
};

export const isForeignKeyError = (error: QueryFailedError) =>
  isErrorWithCode(error, '23503');

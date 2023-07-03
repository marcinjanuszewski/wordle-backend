import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import defaultConfig from './config/default.config';
import { setupSwagger } from './common/swagger/setup-swagger';
import { AllExceptionFilter } from './common/filters/exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(`[PROCESS] Uncaught Exception: ${err.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.log(`[PROCESS] Unhandled rejection at ${promise}, reason: ${reason}`);
});

const appConfig = defaultConfig().application;

export const setupApp = (app: INestApplication) => {
  return app
    .useGlobalFilters(new AllExceptionFilter())
    .useGlobalFilters(new HttpExceptionFilter());
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  setupSwagger(app);

  const port = +appConfig.port;
  await app.listen(port, '0.0.0.0');

  Logger.log(`Application running on port: ${port}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  const port = +appConfig.port;
  await app.listen(port, '0.0.0.0');

  Logger.log(`Application running on port: ${port}`);
}
bootstrap();

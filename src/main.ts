import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import defaultConfig from './config/default.config';
import { Logger } from '@nestjs/common';

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

  const port = +appConfig.port;
  await app.listen(port, '0.0.0.0');

  Logger.log(`Application running on port: ${port}`);
}
bootstrap();

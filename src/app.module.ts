import { Module } from '@nestjs/common';
import defaultConfig from './config/default.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [defaultConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [ConfigModule],
})
export class AppModule {}

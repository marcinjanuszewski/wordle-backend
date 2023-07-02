import { Module } from '@nestjs/common';
import defaultConfig from './config/default.config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [defaultConfig],
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [ConfigModule],
})
export class AppModule {}

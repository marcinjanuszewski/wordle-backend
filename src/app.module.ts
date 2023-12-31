import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import defaultConfig from './config/default.config';
import { DatabaseModule } from './core/database/database.module';
import dbConfig from './core/database/config/db.config';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { GameModule } from './app/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [defaultConfig, dbConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    GameModule,
  ],
  controllers: [],
  providers: [ConfigModule],
})
export class AppModule {}

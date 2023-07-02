import { Module } from '@nestjs/common';

import { GameController } from './game.controller';
import { GameService } from './game.service';

import { DatabaseModule } from '../../core/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { WordModule } from '../word/word.module';

@Module({
  imports: [DatabaseModule, AuthModule, WordModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [],
})
export class GameModule {}

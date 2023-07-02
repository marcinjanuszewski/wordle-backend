import { Inject, Injectable } from '@nestjs/common';

import { GameDto } from './dtos/game.dto';

import GameRepository from '../../core/database/repositories/game.repository';
import { DI_WORD_SERVICE, IWordService } from '../word/word.service';

export interface IGameService {
  startGame(userId: string): Promise<GameDto>;
}

@Injectable()
export class GameService implements IGameService {
  constructor(
    private readonly gameRepository: GameRepository,
    @Inject(DI_WORD_SERVICE) private readonly wordService: IWordService,
  ) {}

  async startGame(userId: string): Promise<GameDto> {
    // todo: think about only 1 game running

    const word = await this.wordService.generateRandomWord();

    const game = await this.gameRepository.save({
      userId,
      word,
    });

    return {
      id: game.id,
      status: game.status,
    };
  }
}

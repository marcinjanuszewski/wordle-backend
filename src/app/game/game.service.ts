import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { GameDto } from './dtos/game.dto';
import { GameStatus } from './types/game-status.enum';

import GameRepository from '../../core/database/repositories/game.repository';
import { DI_WORD_SERVICE, IWordService } from '../word/word.service';
import { ErrorKeys } from '../../common/constant/error-keys.constant';

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
    const startedGamesCount = await this.gameRepository.countBy({
      userId,
      status: GameStatus.STARTED,
    });

    if (startedGamesCount) {
      throw new BadRequestException(ErrorKeys.GAME.GAME_ALREADY_STARTED);
    }

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

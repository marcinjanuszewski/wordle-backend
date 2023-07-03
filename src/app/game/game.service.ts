import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { GameDto } from './dtos/game.dto';
import { GameGuessResultDto } from './dtos/game-guess-result.dto';
import { GameStatus } from './types/game-status.enum';
import WordleValidator from './validator/wordle.validator';
import { GameGuessResult } from './types/game-guess-result.enum';

import GameRepository from '../../core/database/repositories/game.repository';
import { DI_WORD_SERVICE, IWordService } from '../word/word.service';
import { ErrorKeys } from '../../common/constant/error-keys.constant';
import GameGuessRepository from '../../core/database/repositories/game-guess.repository';

export interface IGameService {
  startGame(userId: string): Promise<GameDto>;
  guess(
    userId: string,
    gameId: string,
    guess: string,
  ): Promise<GameGuessResultDto>;
}

export const MAX_GAME_GUESSES = 6;

@Injectable()
export class GameService implements IGameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly gameGuessRepository: GameGuessRepository,
    @Inject(DI_WORD_SERVICE) private readonly wordService: IWordService,
    private readonly wordleValidator: WordleValidator,
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
      word: word.toLocaleLowerCase(),
    });

    return {
      id: game.id,
      status: game.status,
    };
  }

  async guess(
    userId: string,
    gameId: string,
    guess: string,
  ): Promise<GameGuessResultDto> {
    const game = await this.gameRepository.getById(gameId, true);

    if (!game) {
      throw new NotFoundException();
    }

    if (game.userId !== userId) {
      throw new ForbiddenException();
    }

    if (game.status !== GameStatus.STARTED) {
      throw new BadRequestException(ErrorKeys.GAME.GAME_ALREADY_FINISHED);
    }

    const guesses = await this.gameGuessRepository.findByGameId(gameId);

    const guessEntity = await this.gameGuessRepository.save({
      guess: guess.toLocaleLowerCase(),
      gameId,
    });

    const guessResult = this.wordleValidator.validate(game.word, guess);

    if (guessResult.every((gr) => gr.result === GameGuessResult.MATCH)) {
      await this.gameRepository.update(gameId, { status: GameStatus.WON });
    } else if (guesses.length + 1 === MAX_GAME_GUESSES) {
      await this.gameRepository.update(gameId, { status: GameStatus.LOST });
    }

    return {
      id: guessEntity.id,
      gameId,
      guessNumber: guesses.length + 1,
      guessResult,
    };
  }
}

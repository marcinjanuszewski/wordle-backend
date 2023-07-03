import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { createConfigModule } from '../utils/config.util';
import { GameModule } from '../../../src/app/game/game.module';
import { IWordService } from '../../../src/app/word/word.service';
import { DI_WORD_SERVICE } from '../../../src/app/word/word.service';
import userUtil from '../utils/user.util';
import {
  GameService,
  MAX_GAME_GUESSES,
} from '../../../src/app/game/game.service';
import GameRepository from '../../../src/core/database/repositories/game.repository';
import { GameStatus } from '../../../src/app/game/types/game-status.enum';
import UserEntity from '../../../src/core/database/entities/user.entity';
import { ErrorKeys } from '../../../src/common/constant/error-keys.constant';
import { expectRejectedWith } from '../../utils/expect-rejected-with';
import { Id } from '../../../src/common/util/id.util';
import GameGuessRepository from '../../../src/core/database/repositories/game-guess.repository';

describe('game', () => {
  let moduleRef: TestingModule;
  let dataSource: DataSource;
  let gameService: GameService;
  let gameRepository: GameRepository;
  let gameGuessRepository: GameGuessRepository;

  let user: UserEntity;

  const wordMock = 'apple';
  const wordServiceMock: IWordService = {
    generateRandomWord: () => Promise.resolve(wordMock),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [GameModule, createConfigModule()],
    })
      .overrideProvider(DI_WORD_SERVICE)
      .useValue(wordServiceMock)
      .compile();

    await moduleRef.init();

    dataSource = moduleRef.get<DataSource>(DataSource);
    gameService = moduleRef.get<GameService>(GameService);
    gameRepository = moduleRef.get<GameRepository>(GameRepository);
    gameGuessRepository =
      moduleRef.get<GameGuessRepository>(GameGuessRepository);
  });

  beforeEach(async () => {
    user = await userUtil.createUser(dataSource);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('game service', () => {
    describe('start', () => {
      it('should properly start new game', async () => {
        // when
        const game = await gameService.startGame(user.id);

        // then
        expect(game).toHaveProperty('id');
        expect(game.status).toBe(GameStatus.STARTED);

        const gameEntity = await gameRepository.getById(game.id);
        expect(gameEntity.status).toBe(GameStatus.STARTED);
        expect(gameEntity.word).toBe(wordMock);
      });

      it('should throw when game already started', async () => {
        // given
        await gameService.startGame(user.id);

        // when
        await expectRejectedWith(
          gameService.startGame(user.id),
          BadRequestException,
          (err) => {
            expect(err.message).toBe(ErrorKeys.GAME.GAME_ALREADY_STARTED);
          },
        );
      });
    });

    describe('guess', () => {
      it('should mark game as WON when guess properly matches', async () => {
        // given
        const game = await gameRepository.save({
          word: 'apple',
          userId: user.id,
          status: GameStatus.STARTED,
        });

        // when
        const guess = await gameService.guess(user.id, game.id, 'apple');

        // then
        const gameAfter = await gameRepository.getById(game.id);
        expect(gameAfter.status).toBe(GameStatus.WON);

        const guessAfter = await gameGuessRepository.getById(guess.id);
        expect(guessAfter.guess).toBe('apple');
      });

      it('should mark game as LOST when guess does not match and is last attempt', async () => {
        // given
        const game = await gameRepository.save({
          word: 'apple',
          userId: user.id,
          status: GameStatus.STARTED,
        });

        await gameGuessRepository.save(
          Array.from({ length: MAX_GAME_GUESSES - 1 }, () => ({
            gameId: game.id,
            guess: 'pilot',
          })),
        );

        // when
        const guess = await gameService.guess(user.id, game.id, 'pivot');

        // then
        const gameAfter = await gameRepository.getById(game.id);
        expect(gameAfter.status).toBe(GameStatus.LOST);

        const guessAfter = await gameGuessRepository.getById(guess.id);
        expect(guessAfter.guess).toBe('pivot');
      });

      it('should throw when game does not exist', async () => {
        await expectRejectedWith(
          gameService.guess(user.id, Id(), 'apple'),
          NotFoundException,
        );
      });

      it('should throw when game does not belong to user', async () => {
        // given
        const game = await gameRepository.save({
          word: 'apple',
          userId: user.id,
          status: GameStatus.LOST,
        });

        // when&then
        await expectRejectedWith(
          gameService.guess(Id(), game.id, 'apple'),
          ForbiddenException,
        );
      });

      it('should throw when game is already finished', async () => {
        // given
        const game = await gameRepository.save({
          word: 'apple',
          userId: user.id,
          status: GameStatus.LOST,
        });

        // when&then
        await expectRejectedWith(
          gameService.guess(user.id, game.id, 'apple'),
          BadRequestException,
          (err) => {
            expect(err.message).toEqual(ErrorKeys.GAME.GAME_ALREADY_FINISHED);
          },
        );
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { createConfigModule } from '../utils/config.util';
import { GameModule } from '../../../src/app/game/game.module';
import { IWordService } from '../../../src/app/word/word.service';
import { DI_WORD_SERVICE } from '../../../src/app/word/word.service';
import userUtil from '../utils/user.util';
import { GameService } from '../../../src/app/game/game.service';
import GameRepository from '../../../src/core/database/repositories/game.repository';
import { GameStatus } from '../../../src/app/game/types/game-status.enum';
import UserEntity from '../../../src/core/database/entities/user.entity';
import { ErrorKeys } from '../../../src/common/constant/error-keys.constant';
import { expectRejectedWith } from '../../utils/expect-rejected-with';

describe('game', () => {
  let moduleRef: TestingModule;
  let dataSource: DataSource;
  let gameService: GameService;
  let gameRepository: GameRepository;

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
  });

  beforeEach(async () => {
    user = await userUtil.createUser(dataSource);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('game service', () => {
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
});

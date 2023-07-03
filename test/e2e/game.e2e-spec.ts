import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import appUtil from './utils/app.util';

import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/app/auth/auth.service';
import UserRepository from '../../src/core/database/repositories/user.repository';
import { ErrorKeys } from '../../src/common/constant/error-keys.constant';
import { ErrorResponseDto } from '../../src/common/dtos/error-response.dto';
import { GameDto } from '../../src/app/game/dtos/game.dto';
import { GameStatus } from '../../src/app/game/types/game-status.enum';
import GameRepository from '../../src/core/database/repositories/game.repository';
import User from '../../src/app/user/types/user';
import { Id } from '../../src/common/util/id.util';
import { GameGuessDto } from '../../src/app/game/dtos/game-guess.dto';
import userUtil from '../integration/utils/user.util';
import { IWordService, DI_WORD_SERVICE } from '../../src/app/word/word.service';
import { GameGuessResultDto } from '../../src/app/game/dtos/game-guess-result.dto';
import { GameGuessResult } from '../../src/app/game/types/game-guess-result.enum';

describe('GameController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let dataSource: DataSource;
  let gameRepository: GameRepository;
  let userRepository: UserRepository;

  let predefinedUser: User;
  let predefinedAccessToken: string;

  const wordMock = 'apple';
  const wordServiceMock: IWordService = {
    generateRandomWord: () => Promise.resolve(wordMock),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DI_WORD_SERVICE)
      .useValue(wordServiceMock)
      .compile();

    app = await appUtil.setupTestingApp(moduleFixture);

    authService = moduleFixture.get<AuthService>(AuthService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
    gameRepository = moduleFixture.get<GameRepository>(GameRepository);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    const email = `${Date.now()}@a.pl`;
    const { accessToken } = await authService.register(email, '123456');

    predefinedAccessToken = accessToken;
    predefinedUser = await userRepository.getByEmail(email);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/game (POST)', () => {
    it('should return 200 when game properly started', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/game')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${predefinedAccessToken}`);

      // then
      expect(response.status).toBe(HttpStatus.OK);
      const { id, status } = response.body as GameDto;

      expect(status).toBe(GameStatus.STARTED);

      const gameEntity = await gameRepository.getById(id);
      expect(gameEntity.status).toBe(GameStatus.STARTED);
      expect(gameEntity.userId).toBe(predefinedUser.id);
    });

    it('should return 400 when game is already started', async () => {
      // given
      await gameRepository.save({
        userId: predefinedUser.id,
        word: 'apple',
      });

      // when
      const response = await request(app.getHttpServer())
        .post('/game')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${predefinedAccessToken}`);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      const { message } = response.body as ErrorResponseDto;
      expect(message).toBe(ErrorKeys.GAME.GAME_ALREADY_STARTED);
    });

    it('should return 401 when missing auth token', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/game')
        .set('Accept', 'application/json');

      // then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/game/:id/guess (POST)', () => {
    it('should return 200 and change game status to WON', async () => {
      // given
      const game = await gameRepository.save({
        userId: predefinedUser.id,
        word: 'apple',
      });

      // when
      const body: GameGuessDto = {
        guess: 'apple',
      };
      const response = await request(app.getHttpServer())
        .post(`/game/${game.id}/guess`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${predefinedAccessToken}`)
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.OK);

      const { gameId, guessNumber, guessResult, isProperGuess } =
        response.body as GameGuessResultDto;

      expect(gameId).toBe(game.id);
      expect(isProperGuess).toBe(true);
      expect(guessNumber).toBe(1);

      expect(guessResult.map((r) => r.letter).join('')).toBe('apple');
      expect(guessResult.map((r) => r.letterIndex)).toEqual([0, 1, 2, 3, 4]);
      expect(guessResult.every((r) => r.result === GameGuessResult.MATCH));

      const gameAfter = await gameRepository.getById(gameId);
      expect(gameAfter.status).toBe(GameStatus.WON);
    });

    it('should return 400 Bad Request when id is invalid', async () => {
      // when
      const body: GameGuessDto = {
        guess: 'orange',
      };
      const response = await request(app.getHttpServer())
        .post(`/game/123/guess`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${predefinedAccessToken}`)
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 Bad Request when game guess is invalid', async () => {
      // given
      const body: GameGuessDto = {
        guess: 'orange',
      };

      // when
      const response = await request(app.getHttpServer())
        .post(`/game/${Id()}/guess`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${predefinedAccessToken}`)
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 401 when missing auth token', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post(`/game/${Id()}/guess`)
        .set('Accept', 'application/json');

      // then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 403 when game does not belong to user', async () => {
      // given
      const user = await userUtil.createUser(dataSource, {
        email: `${Date.now()}@abc.pl`,
      });
      const game = await gameRepository.save({
        userId: user.id,
        word: 'apple',
      });

      // when
      const body: GameGuessDto = {
        guess: 'apple',
      };
      const response = await request(app.getHttpServer())
        .post(`/game/${game.id}/guess`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${predefinedAccessToken}`)
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 404 when game not found', async () => {
      // given
      const body: GameGuessDto = {
        guess: 'apple',
      };

      // when
      const response = await request(app.getHttpServer())
        .post(`/game/${Id()}/guess`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${predefinedAccessToken}`)
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

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

describe('GameController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let gameRepository: GameRepository;
  let userRepository: UserRepository;

  let predefinedUser: User;
  let predefinedAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await appUtil.setupTestingApp(moduleFixture);

    authService = moduleFixture.get<AuthService>(AuthService);
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
});

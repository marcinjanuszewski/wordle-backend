import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import jwtUtil from '@/common/util/jwt.util';

import appUtil from './utils/app.util';

import { AppModule } from '../../src/app.module';
import { LoginDto } from '../../src/app/auth/dtos/login.dto';
import { ErrorResponseDto } from '../../src/common/dtos/error-response.dto';
import { ErrorKeys } from '../../src/common/constant/error-keys.constant';
import { AuthService } from '../../src/app/auth/auth.service';
import { AuthTokensDto } from '../../src/app/auth/dtos/auth-tokens.dto';
import UserRepository from '../../src/core/database/repositories/user.repository';
import { RegisterDto } from '../../src/app/auth/dtos/register.dto';
import { UserDetailsDto } from '../../src/app/auth/dtos/user-details.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await appUtil.setupTestingApp(moduleFixture);

    authService = moduleFixture.get<AuthService>(AuthService);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/sign-in (POST)', () => {
    it('should return 200 OK when properly logged in', async () => {
      // given
      const body: LoginDto = {
        email: `${Date.now()}@a.pl`,
        password: '123456',
      };

      await authService.register(body.email, body.password);

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .set('Accept', 'application/json')
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.OK);

      const { accessToken, refreshToken } = response.body as AuthTokensDto;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBe('todo');

      const user = await userRepository.getByEmail(body.email);

      const jwtPayload = jwtUtil.decode(accessToken);
      expect(jwtPayload.email).toBe(body.email);
      expect(jwtPayload.sub).toBe(user.id);
    });

    it('should return 400 Bad Request when login data is invalid', async () => {
      // given
      const body: LoginDto = {
        email: `${Date.now()}@a.pl`,
        password: '123456',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .set('Accept', 'application/json')
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      const { errorId, message } = response.body as ErrorResponseDto;
      expect(errorId).toBeDefined();
      expect(message).toEqual(ErrorKeys.AUTH.WRONG_EMAIL_OR_PASSWORD);
    });

    it('should return 400 Bad Request when password does not match requirements', async () => {
      // given
      const body: LoginDto = {
        email: `${Date.now()}@a.pl`,
        password: '12',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .set('Accept', 'application/json')
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/sign-up (POST)', () => {
    it('should return 200 OK when properly created account', async () => {
      // given
      const body: RegisterDto = {
        email: `${Date.now()}@a.pl`,
        password: '123456',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .set('Accept', 'application/json')
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.OK);

      const { accessToken, refreshToken } = response.body as AuthTokensDto;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBe('todo');

      const user = await userRepository.getByEmail(body.email);

      const jwtPayload = jwtUtil.decode(accessToken);
      expect(jwtPayload.email).toBe(body.email);
      expect(jwtPayload.sub).toBe(user.id);
    });

    it('should return 400 Bad Request when email is already taken', async () => {
      // given
      const body: RegisterDto = {
        email: `${Date.now()}@a.pl`,
        password: '123456',
      };

      await authService.register(body.email, body.password);

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .set('Accept', 'application/json')
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      const { errorId, message } = response.body as ErrorResponseDto;
      expect(errorId).toBeDefined();
      expect(message).toEqual(ErrorKeys.AUTH.EMAIL_ALREADY_TAKEN);
    });

    it('should return 400 Bad Request when password does not match requirements', async () => {
      // given
      const body: RegisterDto = {
        email: `${Date.now()}@a.pl`,
        password: '12',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .set('Accept', 'application/json')
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/me (GET)', () => {
    it('should return 200 OK with user email', async () => {
      // given
      const body: RegisterDto = {
        email: `${Date.now()}@a.pl`,
        password: '123456',
      };

      const { accessToken } = await authService.register(
        body.email,
        body.password,
      );

      // when
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.OK);

      const { id, email } = response.body as UserDetailsDto;
      expect(email).toEqual(body.email);

      const user = await userRepository.getByEmail(body.email);
      expect(user.id).toBe(id);
    });

    it('should return 401 Unauthorized when request does not contain token', async () => {
      // given
      const body: RegisterDto = {
        email: `${Date.now()}@a.pl`,
        password: '12',
      };

      // when
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .send(body);

      // then
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});

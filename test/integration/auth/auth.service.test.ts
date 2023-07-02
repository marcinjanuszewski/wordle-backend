import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { createConfigModule } from '../utils/config.util';
import { expectRejectedWith } from '../../utils/expect-rejected-with';
import { AuthService } from '../../../src/app/auth/auth.service';
import { AuthModule } from '../../../src/app/auth/auth.module';
import UserRepository from '../../../src/core/database/repositories/user.repository';
import { ErrorKeys } from '../../../src/common/constant/error-keys.constant';

describe('auth', () => {
  let moduleRef: TestingModule;

  let authService: AuthService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule, createConfigModule()],
    }).compile();

    await moduleRef.init();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('auth service', () => {
    describe('login', () => {
      it('should properly login and return tokens', async () => {
        // given
        const email = 'johndoe@example.com';
        const password = 'Pa$word123';

        await authService.register(email, password);

        // when
        const result = await authService.login(email, password);

        // then
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
      });

      it('should throw when email does not exist', async () => {
        const email = 'johndoe@example.com';
        const password = 'Pa$word123';

        await expectRejectedWith(
          authService.login(email, password),
          BadRequestException,
          (err) => {
            expect(err.message).toBe(ErrorKeys.AUTH.WRONG_EMAIL_OR_PASSWORD);
          },
        );
      });

      it('should throw when password does not match', async () => {
        const email = 'johndoe@example.com';
        const password = 'Pa$word123';

        await authService.register(email, `${password}123`);

        await expectRejectedWith(
          authService.login(email, password),
          BadRequestException,
          (err) => {
            expect(err.message).toBe(ErrorKeys.AUTH.WRONG_EMAIL_OR_PASSWORD);
          },
        );
      });
    });

    describe('register', () => {
      it('should properly register account and return tokens', async () => {
        const email = 'johndoe@example.com';
        const password = 'Pa$word123';

        const result = await authService.register(email, password);
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
      });

      it('should throw when email is already taken', async () => {
        const email = 'johndoe@example.com';
        const password = 'Pa$word123';

        await userRepository.save({ email, passwordHash: 'someHash' });

        await expectRejectedWith(
          authService.register(email, password),
          BadRequestException,
          (err) => {
            expect(err.message).toBe(ErrorKeys.AUTH.EMAIL_ALREADY_TAKEN);
          },
        );
      });
    });
  });
});

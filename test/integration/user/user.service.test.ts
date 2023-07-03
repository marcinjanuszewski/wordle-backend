import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryFailedError } from 'typeorm';

import { createConfigModule } from '../utils/config.util';
import userUtil from '../utils/user.util';
import UserEntity from '../../../src/core/database/entities/user.entity';
import { UserModule } from '../../../src/app/user/user.module';
import { UserService } from '../../../src/app/user/user.service';
import UserRepository from '../../../src/core/database/repositories/user.repository';
import { Id } from '../../../src/common/util/id.util';
import { expectRejectedWith } from '../../utils/expect-rejected-with';
import { isUniqueConstraintError } from '../utils/db.helper';

describe('user', () => {
  let moduleRef: TestingModule;
  let dataSource: DataSource;
  let userService: UserService;
  let userRepository: UserRepository;

  let predefinedUser: UserEntity;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule, createConfigModule()],
    }).compile();

    await moduleRef.init();

    dataSource = moduleRef.get<DataSource>(DataSource);
    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    predefinedUser = await userUtil.createUser(dataSource);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('user service', () => {
    describe('getById', () => {
      it('should return null when user does not exist', async () => {
        const id = Id();
        const user = await userService.getById(id);

        expect(user).toBeNull();
      });

      it('should properly return user', async () => {
        const { id, email, passwordHash } = predefinedUser;

        const userResult = await userService.getById(id);
        expect(userResult).toEqual(
          expect.objectContaining({ id, email, passwordHash }),
        );
      });
    });

    describe('getByEmail', () => {
      it('should return null when user does not exist', async () => {
        const user = await userService.getByEmail('janusztracz@a.pl');

        expect(user).toBeNull();
      });

      it('should properly return user', async () => {
        const { id, email, passwordHash } = predefinedUser;

        const userResult = await userService.getByEmail(email);

        expect(userResult).toEqual(
          expect.objectContaining({ id, email, passwordHash }),
        );
      });
    });

    describe('save', () => {
      it('should properly save user', async () => {
        const { id, email, passwordHash } = await userService.save({
          email: 'janusztracz@a.pl',
          passwordHash: 'hash',
        });

        expect(email).toEqual('janusztracz@a.pl');
        expect(passwordHash).toEqual('hash');

        const userEntity = await userRepository.getById(id);
        expect(userEntity).toEqual(
          expect.objectContaining({ id, email, passwordHash }),
        );
      });

      it('should throw when email is already taken', async () => {
        const { email, passwordHash } = predefinedUser;
        const savePromise = userService.save({ email, passwordHash });

        await expectRejectedWith(savePromise, QueryFailedError, (err) => {
          expect(isUniqueConstraintError(err, 'UK_USER_EMAIL')).toBeTruthy();
        });
      });
    });
  });
});

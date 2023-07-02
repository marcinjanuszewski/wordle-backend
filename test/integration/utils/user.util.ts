import { DataSource } from 'typeorm';

import UserEntity from '../../../src/core/database/entities/user.entity';
import UserRepository from '../../../src/core/database/repositories/user.repository';

const userMock = (): Partial<UserEntity> => ({
  email: 'janusztracz@wordle.api',
  passwordHash: 'somehash',
});

const createUser = async (
  dataSource: DataSource,
  userPartial?: Partial<UserEntity>,
): Promise<UserEntity> => {
  const manager = dataSource.createEntityManager();
  const userRepository = new UserRepository(manager);

  return await userRepository.save({
    ...userMock(),
    ...userPartial,
  });
};

export default { createUser };

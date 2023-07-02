import { Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import UserEntity from '../entities/user.entity';

export interface IUserRepository extends Repository<UserEntity> {
  getById(id: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
}

@Injectable()
export default class UserRepository
  extends Repository<UserEntity>
  implements IUserRepository
{
  constructor(public readonly manager: EntityManager) {
    super(UserEntity, manager);
  }

  getById(id: string): Promise<UserEntity> {
    return this.findOneBy({ id: id! });
  }
  getByEmail(email: string): Promise<UserEntity> {
    return this.findOneBy({ email: email! });
  }
}

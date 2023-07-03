import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import BaseRepository, { IBaseRepository } from './base.repository';

import UserEntity from '../entities/user.entity';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  getByEmail(email: string): Promise<UserEntity | null>;
}

@Injectable()
export default class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(public readonly manager: EntityManager) {
    super(UserEntity, manager);
  }

  getByEmail(email: string): Promise<UserEntity | null> {
    return this.findOneBy({ email: email! });
  }
}

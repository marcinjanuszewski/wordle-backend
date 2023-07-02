import { Repository } from 'typeorm';
import UserEntity from '../entities/user.entity';

export interface IUserRepository extends Repository<UserEntity> {
  getById(id: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
}

export default class UserRepository
  extends Repository<UserEntity>
  implements IUserRepository
{
  getById(id: string): Promise<UserEntity> {
    return this.findOneBy({ id: id! });
  }
  getByEmail(email: string): Promise<UserEntity> {
    return this.findOneBy({ email: email! });
  }
}

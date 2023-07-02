import { IUserRepository } from '../../core/database/repositories/user.repository';
import User from './types/user';

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  save(user: Partial<User>): Promise<User>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  getById(id: string): Promise<User> {
    return this.userRepository.getById(id);
  }

  getByEmail(email: string): Promise<User> {
    return this.userRepository.getByEmail(email);
  }

  save(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }
}

import { Injectable } from '@nestjs/common';

import User from './types/user';

import UserRepository from '../../core/database/repositories/user.repository';

export interface IUserService {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  save(user: Partial<User>): Promise<User>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

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

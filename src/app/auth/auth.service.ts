import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthTokensDto } from './dtos/auth-tokens.dto';

import { UserService } from '../user/user.service';
import User from '../user/types/user';
import { ErrorKeys } from '../../common/constant/error-keys.constant';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthTokensDto>;
  register(email: string, password: string): Promise<AuthTokensDto>;
  refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthTokensDto>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  refreshToken(
    _accessToken: string,
    _refreshToken: string,
  ): Promise<AuthTokensDto> {
    throw new Error('Method not implemented.');
  }

  async login(email: string, password: string): Promise<AuthTokensDto> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new BadRequestException(ErrorKeys.AUTH.WRONG_EMAIL_OR_PASSWORD);
    }

    const isPasswordVerified = await bcrypt.compare(
      password,
      user.passwordHash,
    );
    if (!isPasswordVerified) {
      throw new BadRequestException(ErrorKeys.AUTH.WRONG_EMAIL_OR_PASSWORD);
    }

    return this.createAuthTokens(user);
  }

  async register(email: string, password: string): Promise<AuthTokensDto> {
    const user = await this.userService.getByEmail(email);

    if (user) {
      throw new BadRequestException(ErrorKeys.AUTH.EMAIL_ALREADY_TAKEN);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.userService.save({
      email,
      passwordHash,
    });

    return this.createAuthTokens(newUser);
  }

  private async createAuthTokens(user: User): Promise<AuthTokensDto> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: 'todo',
    };
  }
}

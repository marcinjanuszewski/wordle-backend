import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfig } from '@/config/default.config';

import { UserService } from '../../user/user.service';
import User from '../../user/types/user';

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  iss: string;
}

@Injectable()
export class LocalJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const authConfig = configService.get<AuthConfig>('auth');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
      issuer: authConfig.issuer,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.getByEmail(payload.email);

    if (!user || user.id !== payload.sub) {
      throw new Error('UNAUTHORIZED');
    }

    return { id: user.id, email: user.email };
  }
}

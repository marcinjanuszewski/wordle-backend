import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { AuthConfig } from '@/config/default.config';

type SignAndVerifyOptions = {
  algorithm?: jwt.Algorithm;
  issuer: string;
  expiresIn: string;
};

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    const authConfig = this.configService.get<AuthConfig>('auth');
    const signAndVerifyOptions: SignAndVerifyOptions = {
      issuer: authConfig.issuer,
      expiresIn: `${authConfig.jwtExpirationInMinutes}m`,
    };

    return {
      secret: authConfig.jwtSecret,
      signOptions: signAndVerifyOptions,
      verifyOptions: signAndVerifyOptions,
    };
  }
}

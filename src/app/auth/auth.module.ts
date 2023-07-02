import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { JwtConfigService } from './services/jwt-config.service';
import { AuthController } from './auth.controller';
import { LocalJwtStrategy } from './strategies/local-jwt.stategy';

import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalJwtStrategy],
  exports: [AuthService, LocalJwtStrategy],
})
export class AuthModule {}

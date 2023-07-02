import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserService } from './user.service';

import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [ConfigModule, UserService],
  exports: [UserService],
})
export class UserModule {}

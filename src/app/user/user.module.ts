import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../core/database/database.module';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [ConfigModule, UserService],
  exports: [UserService],
})
export class UserModule {}

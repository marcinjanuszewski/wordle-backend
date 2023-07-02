import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private type: string | string[], private reflector: Reflector) {
    super(type);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check if user has access
    let isAuthorized: boolean;
    try {
      const result = await super.canActivate(context);
      isAuthorized = !!result;
    } catch (err) {
      isAuthorized = false;
    }

    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

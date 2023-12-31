import {
  Get,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthTokensDto } from './dtos/auth-tokens.dto';
import { LoginDto, LoginDtoSchema } from './dtos/login.dto';
import { RegisterDto, RegisterDtoSchema } from './dtos/register.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import ContextUser from './decorators/context-user.decorator';
import JwtAuth from './decorators/jwt-auth.decorator';
import { UserDetailsDto } from './dtos/user-details.dto';

import { SchemaValidationPipe } from '../../common/pipe/schema-validation.pipe';
import User from '../user/types/user';
import { ErrorResponseDto } from '../../common/dtos/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiOperation({ summary: 'Login user' })
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body(new SchemaValidationPipe(LoginDtoSchema)) dto: LoginDto,
  ): Promise<AuthTokensDto> {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('/sign-up')
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiOperation({ summary: 'Register user' })
  @HttpCode(HttpStatus.OK)
  signUp(
    @Body(new SchemaValidationPipe(RegisterDtoSchema)) dto: RegisterDto,
  ): Promise<AuthTokensDto> {
    return this.authService.register(dto.email, dto.password);
  }

  @Get('/me')
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @JwtAuth()
  me(@ContextUser() user: User): Promise<UserDetailsDto> {
    return Promise.resolve({ id: user.id, email: user.email });
  }

  // todo: implement refresh token logic
}

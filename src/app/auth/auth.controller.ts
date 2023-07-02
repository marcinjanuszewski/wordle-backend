import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthTokensDto } from './dtos/auth-tokens.dto';
import { SchemaValidationPipe } from '../../common/pipe/schema-validation.pipe';
import { LoginDto, LoginDtoSchema } from './dtos/login.dto';
import { RegisterDto, RegisterDtoSchema } from './dtos/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  @ApiOperation({ summary: 'Login user' })
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body(new SchemaValidationPipe(LoginDtoSchema)) dto: LoginDto,
  ): Promise<AuthTokensDto> {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('/sign-up')
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 404 })
  @ApiOperation({ summary: 'Login user' })
  @HttpCode(HttpStatus.OK)
  signUp(
    @Body(new SchemaValidationPipe(RegisterDtoSchema)) dto: RegisterDto,
  ): Promise<AuthTokensDto> {
    return this.authService.register(dto.email, dto.password);
  }
}

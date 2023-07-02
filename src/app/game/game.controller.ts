import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import JwtAuth from '@/app/auth/decorators/jwt-auth.decorator';
import ContextUser from '@/app/auth/decorators/context-user.decorator';

import { GameService } from './game.service';
import { GameDto } from './dtos/game.dto';

import User from '../user/types/user';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/')
  @ApiResponse({ status: 200, type: GameDto })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 401 })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @JwtAuth()
  public startNewGame(@ContextUser() user: User): Promise<GameDto> {
    return this.gameService.startGame(user.id);
  }
}

import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UseGuards,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import JwtAuth from '@/app/auth/decorators/jwt-auth.decorator';
import ContextUser from '@/app/auth/decorators/context-user.decorator';

import { GameService } from './game.service';
import { GameDto } from './dtos/game.dto';
import { GameGuessResultDto } from './dtos/game-guess-result.dto';
import { GameGuessDto, GameGuessDtoSchema } from './dtos/game-guess.dto';

import User from '../user/types/user';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SchemaValidationPipe } from '../../common/pipe/schema-validation.pipe';
import { ErrorResponseDto } from '../../common/dtos/error-response.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/')
  @ApiResponse({ status: 200, type: GameDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @JwtAuth()
  public startNewGame(@ContextUser() user: User): Promise<GameDto> {
    return this.gameService.startGame(user.id);
  }

  @Post('/:id/guess')
  @ApiResponse({ status: 200, type: GameGuessResultDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @JwtAuth()
  public guess(
    @Param('id', ParseUUIDPipe) gameId: string,
    @ContextUser() user: User,
    @Body(new SchemaValidationPipe(GameGuessDtoSchema))
    gameGuessDto: GameGuessDto,
  ): Promise<GameGuessResultDto> {
    return this.gameService.guess(user.id, gameId, gameGuessDto.guess);
  }
}

import { ApiProperty } from '@nestjs/swagger';

import { GameGuessResult } from '../types/game-guess-result.enum';

export class LetterGuessDto {
  @ApiProperty()
  letterIndex: number;

  @ApiProperty()
  letter: string;

  @ApiProperty({ enum: Object.values(GameGuessResult) })
  result: GameGuessResult;
}

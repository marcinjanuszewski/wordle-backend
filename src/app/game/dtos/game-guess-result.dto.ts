import { ApiProperty } from '@nestjs/swagger';

import { LetterGuessDto } from './letter-guess.dto';

export class GameGuessResultDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  gameId: string;

  @ApiProperty({ type: 'number', format: 'integer' })
  guessNumber: number;

  @ApiProperty()
  isProperGuess: boolean;

  @ApiProperty()
  guessResult: LetterGuessDto[];
}

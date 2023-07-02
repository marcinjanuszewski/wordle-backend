import { ApiProperty } from '@nestjs/swagger';
import { GameStatus } from '../types/game-status.enum';

export class GameDto {
  @ApiProperty({
    description: `Game id`,
  })
  public id: string;

  @ApiProperty({
    description: 'Game status',
    enum: GameStatus,
  })
  public status: GameStatus;
}

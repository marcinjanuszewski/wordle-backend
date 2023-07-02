import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Used to make tracking error faster',
  })
  errorId: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;
}

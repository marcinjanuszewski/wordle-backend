import { ApiProperty } from '@nestjs/swagger';

export class UserDetailsDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public email: string;
}

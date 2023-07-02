import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const RegisterDtoSchema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().regex(/.{3,}/),
}).options({ allowUnknown: false, presence: 'required' });

export class RegisterDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: `The user's email`,
  })
  email: string;

  @ApiProperty({
    example: 'Pa$$word123',
    description: `The user's password`,
  })
  password: string;
}

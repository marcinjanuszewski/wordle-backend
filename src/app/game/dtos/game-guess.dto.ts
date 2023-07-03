import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const GameGuessDtoSchema: Joi.ObjectSchema = Joi.object({
  guess: Joi.string().min(5).max(5),
}).options({ allowUnknown: false, presence: 'required' });

export class GameGuessDto {
  @ApiProperty()
  guess: string;
}

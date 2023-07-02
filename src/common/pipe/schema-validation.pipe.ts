import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import Joi from 'joi';

import { JoiException } from '../error/joi-exception';

@Injectable()
export class SchemaValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema) {}

  public async transform(
    obj: Record<string, unknown>,
    _metadata: ArgumentMetadata,
  ): Promise<Record<string, unknown>> {
    const { error, value } = (this.schema as any).validate(obj);
    if (!error) {
      return value;
    }

    if (Array.isArray(error.details) && error.details.length) {
      throw new JoiException(error.details.at(0).message);
    }
    throw new JoiException(error.toString());
  }
}

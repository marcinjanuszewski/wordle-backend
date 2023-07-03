import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';

import { Id } from '../util/id.util';

const ERROR_ID_HEADER = 'error-id';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorId = Id();

    AllExceptionFilter.logger.error(
      `Exception occurred. ErrorId: ${errorId}. Message: ${exception.message}`,
      exception.stack,
    );

    return response.header(ERROR_ID_HEADER, errorId).status(500).send({
      statusCode: 500,
      message: 'Internal server error',
      errorId,
    });
  }
}

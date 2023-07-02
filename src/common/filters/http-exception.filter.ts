import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const ERROR_ID_HEADER = 'error-id';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorId = uuidv4();
    const exceptionResponse = exception.getResponse();

    HttpExceptionFilter.logger.error(
      `Http exception occurred. Path: ${
        request.path
      }. ErrorId: ${errorId} Status: ${status}. ${JSON.stringify(
        exceptionResponse,
      )}`,
    );

    const message =
      typeof exceptionResponse === 'object'
        ? exceptionResponse
        : { message: exceptionResponse };

    return response
      .status(status)
      .header(ERROR_ID_HEADER, errorId)
      .send({
        errorId,
        statusCode: status,
        ...message,
      });
  }
}

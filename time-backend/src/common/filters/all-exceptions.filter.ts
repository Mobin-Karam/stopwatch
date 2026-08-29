import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { appLogger } from '../../observability/logger/pino-logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception?.message as string) || 'Internal server error';

    appLogger.error({
      msg: 'request error',
      status,
      path: request?.url,
      method: request?.method,
      userId: request?.user?.id || request?.session?.userId || 'anon',
      sessionId: request?.sessionID || 'none',
      requestId: request?.requestId,
      error: exception?.stack || exception,
    });

    response.status(status).json({
      statusCode: status,
      message,
      requestId: request?.requestId,
    });
  }
}

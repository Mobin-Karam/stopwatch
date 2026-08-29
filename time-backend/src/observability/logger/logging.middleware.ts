import { Injectable, NestMiddleware } from '@nestjs/common';
import { appLogger } from './pino-logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = performance.now();
    res.on('finish', () => {
      const duration = performance.now() - start;
      appLogger.info({
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        duration,
        userId: req.user?.id || req.session?.userId || 'anon',
        sessionId: req.sessionID || 'none',
        requestId: req.requestId,
      });
    });
    next();
  }
}

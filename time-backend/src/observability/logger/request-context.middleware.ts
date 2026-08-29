import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

/**
 * Attaches a per-request correlation id for tracing across logs and downstream calls.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const requestId =
      req.headers['x-request-id'] ||
      req.headers['x-correlation-id'] ||
      randomUUID();
    req.requestId = String(requestId);
    res.setHeader('x-request-id', req.requestId);
    next();
  }
}

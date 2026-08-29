import { Injectable, NestMiddleware } from '@nestjs/common';
import { httpRequestDuration } from './metrics.registry';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const end = httpRequestDuration.startTimer({
      method: req.method,
      route: req.route?.path || req.originalUrl || 'unknown',
    });

    res.on('finish', () => {
      end({ status_code: res.statusCode });
    });

    next();
  }
}

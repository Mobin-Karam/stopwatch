import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { Public } from './common/guards/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  health() {
    return this.appService.getHealth();
  }
}

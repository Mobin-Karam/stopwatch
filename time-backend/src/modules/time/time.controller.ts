import { Controller, Get, Query } from '@nestjs/common';
import { TimeService } from './time.service';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get('world-clock')
  worldClock(@Query('zones') zones?: string) {
    return this.timeService.worldClock(zones ? [zones] : undefined);
  }

  @Get('convert')
  convert(@Query('time') time: string, @Query('zones') zones?: string) {
    const zoneList = zones ? zones.split(',').map((z) => z.trim()) : undefined;
    return this.timeService.convertTime(time, zoneList);
  }

  @Get('zones')
  zones(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.timeService.supportedZones(parsed);
  }
}

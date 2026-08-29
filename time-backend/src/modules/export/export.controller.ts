import { Controller, Get, Req, Res, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ExportService } from './export.service';
import { UserService } from '../user/user.service';
import type { Response } from 'express';
import { AuthenticatedGuard } from '../../common/guards/guards';

@Controller('export')
@UseGuards(AuthenticatedGuard)
export class ExportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly userService: UserService,
  ) {}

  private async ensureUser(req: any) {
    if (req.user) {
      if (!req.session?.userId) req.session.userId = req.user.id;
      return req.user;
    }
    if (!req.session?.userId) {
      throw new UnauthorizedException();
    }
    return this.userService.getUser(req.session.userId);
  }

  @Get()
  async export(@Req() req: any) {
    const user = await this.ensureUser(req);
    const data = await this.exportService.fullExport(user._id);
    return data;
  }

  @Get('csv')
  async exportCsv(
    @Req() req: any,
    @Res() res: Response,
    @Query('type') type?: 'planner' | 'timer',
  ) {
    const user = await this.ensureUser(req);
    const csv = await this.exportService.csvExport(user._id, type ?? 'planner');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${type ?? 'planner'}-export.csv`,
    );
    res.send(csv);
  }
}

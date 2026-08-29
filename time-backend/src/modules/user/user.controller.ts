import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Temporary: use a default user (replace with real auth integration)
  private async ensureUser(req: any) {
    if (req.user) {
      if (!req.session?.userId) {
        req.session.userId = req.user.id;
      }
      return req.user;
    }
    if (!req.session.userId) {
      const user = await this.userService.getOrCreateDefault();
      req.session.userId = user.id;
      return user;
    }
    return this.userService.getUser(req.session.userId);
  }

  @Get('me')
  async me(@Req() req: any) {
    const user = await this.ensureUser(req);
    return { user };
  }

  @Post('locale')
  async locale(@Req() req: any, @Body() body: any) {
    req.session.lang = body.lang;
    return { ok: true };
  }

  @Post('preferences')
  async preferences(@Req() req: any, @Body() body: any) {
    const user = await this.ensureUser(req);
    if (!user) return { user: null };
    const updated = await this.userService.updatePreferences(user.id, {
      name: body.name,
      theme: body.theme,
    });
    return { user: updated };
  }

  @Get('stopwatch')
  async getStopwatch(@Req() req: any) {
    const user = await this.ensureUser(req);
    return { lastStopwatch: user?.lastStopwatch ?? null };
  }

  @Post('stopwatch')
  async saveStopwatch(@Req() req: any, @Body() body: any) {
    const user = await this.ensureUser(req);
    if (!user) return { lastStopwatch: null };
    const updated = await this.userService.saveStopwatch(
      user.id,
      body.elapsedMs ?? 0,
      body.laps ?? [],
    );
    return { lastStopwatch: updated?.lastStopwatch ?? null };
  }
}

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Public } from '../../common/guards/public.decorator';
import { GithubAuthGuard, GoogleAuthGuard } from '../../common/guards/guards';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Public()
  @Get('google')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() _req, @Res() res) {
    return res.redirect(process.env.FRONTEND_ORIGIN || 'http://localhost:3000');
  }

  @Public()
  @Get('github')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(GithubAuthGuard)
  async githubAuth() {
    return;
  }

  @Get('github/callback')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() _req, @Res() res) {
    return res.redirect(process.env.FRONTEND_ORIGIN || 'http://localhost:3000');
  }

  @Get('logout')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async logout(@Req() req, @Res() res) {
    req.logout(() => {
      req.session?.destroy(() => {
        res.clearCookie('connect.sid', {
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          domain:
            process.env.COOKIE_DOMAIN ||
            (process.env.NODE_ENV === 'production' ? 'divtime.ir' : undefined),
        });
        res.json({ ok: true });
      });
    });
  }

  @Get('me')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  async me(@Req() req: any) {
    return { user: req.user || null };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { UserService } from '../user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly userService: UserService) {
    const baseUrl =
      process.env.APP_BASE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://divtime.ir'
        : 'http://localhost:3000');
    super({
      clientID: process.env.GITHUB_CLIENT_ID || 'github-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'github-secret',
      callbackURL: new URL('/api/auth/github/callback', baseUrl).toString(),
      state: true,
      pkce: true,
      passReqToCallback: true,
      scope: ['user:email'],
    });
  }

  async validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err, user, info?) => void,
  ) {
    const email =
      profile.emails?.[0]?.value || `${profile.username}@github.com`;
    const displayName = profile.displayName || profile.username;
    const user = await this.userService.findOrCreateOauth({
      provider: 'github',
      providerId: profile.id,
      email,
      name: displayName,
    });
    done(null, user);
  }
}

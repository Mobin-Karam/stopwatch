import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UserService) {
    const baseUrl =
      process.env.APP_BASE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://divtime.ir'
        : 'http://localhost:3000');
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'google-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-secret',
      callbackURL: new URL('/api/auth/google/callback', baseUrl).toString(),
      state: true,
      pkce: true,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    const displayName = profile.displayName || email;
    const user = await this.userService.findOrCreateOauth({
      provider: 'google',
      providerId: profile.id,
      email,
      name: displayName,
    });
    done(null, user);
  }
}

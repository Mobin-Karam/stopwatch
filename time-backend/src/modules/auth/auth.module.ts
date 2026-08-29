import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';
import { SessionSerializer } from './session.serializer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PassportModule.register({ session: true }), ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, GithubStrategy, SessionSerializer],
})
export class AuthModule {}

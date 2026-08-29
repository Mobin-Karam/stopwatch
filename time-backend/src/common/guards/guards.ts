import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException, CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { randomBytes } from 'crypto';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY, Role } from './roles.decorator';

const resolveCallback = (
  config: ConfigService,
  requested: string | undefined,
  providerPath: string,
) => {
  const baseCandidates = [
    config.get<string>('APP_BASE_URL'),
    ...(config.get<string>('FRONTEND_ORIGIN') || '')
      .split(',')
      .map((item) => item.trim()),
    'http://localhost:3000',
  ].filter((b): b is string => Boolean(b));

  const fallback = new URL(providerPath, baseCandidates[0]).toString();
  if (!requested) return fallback;

  try {
    const url = new URL(requested);
    const allowed = baseCandidates.some((base) => {
      try {
        const allowedUrl = new URL(base);
        return url.origin === allowedUrl.origin;
      } catch {
        return false;
      }
    });
    if (!allowed) return fallback;
    if (url.pathname !== providerPath) return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
};

const generateState = () => randomBytes(16).toString('hex');

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const isCallback = typeof req.query?.code === 'string';
    const callbackURL = resolveCallback(
      this.config,
      typeof req.query?.redirect_uri === 'string'
        ? req.query.redirect_uri
        : undefined,
      '/api/auth/google/callback',
    );
    if (isCallback) return { callbackURL };

    const state = generateState();
    const prompt =
      typeof req.query?.prompt === 'string'
        ? req.query.prompt
        : 'select_account';
    return { callbackURL, state, prompt };
  }
}

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const isCallback = typeof req.query?.code === 'string';
    const callbackURL = resolveCallback(
      this.config,
      typeof req.query?.redirect_uri === 'string'
        ? req.query.redirect_uri
        : undefined,
      '/api/auth/github/callback',
    );
    if (isCallback) return { callbackURL };

    const state = generateState();
    return { callbackURL, state };
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req: any = context.switchToHttp().getRequest();
    const isAuthed =
      req.isAuthenticated?.() ||
      Boolean(req.user) ||
      Boolean(req.session?.userId);
    if (!isAuthed) throw new UnauthorizedException();
    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const req: any = context.switchToHttp().getRequest();
    const user = req.user;
    const userRole: Role = (user?.role as Role) || 'user';
    if (roles.includes(userRole)) return true;
    throw new ForbiddenException('Insufficient role');
  }
}

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  const frontendOrigins = (
    process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/time';
  const sessionSecret = process.env.SESSION_SECRET || 'dev-secret';
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain =
    process.env.COOKIE_DOMAIN || (isProduction ? 'divtime.ir' : undefined);

  app.set('trust proxy', 1);
  app.use(helmet());

  app.enableCors({
    origin: frontendOrigins,
    credentials: true,
  });

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: mongoUri }),
      cookie: {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        domain: cookieDomain,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();

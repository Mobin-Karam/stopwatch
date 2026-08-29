import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  const userService = app.get(UserService);

  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    console.error('Set ADMIN_EMAIL to promote a user');
    process.exit(1);
  }
  const user = await userService.findByEmail(email);
  if (!user) {
    console.error(`User with email ${email} not found`);
    process.exit(1);
  }
  await userService.setRole(user.id, 'admin');
  console.log(`Promoted ${email} to admin`);
  await app.close();
}

bootstrap();

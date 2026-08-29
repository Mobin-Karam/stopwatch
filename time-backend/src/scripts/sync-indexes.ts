import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['warn', 'error'],
  });

  const connection = app.get<Connection>(getConnectionToken());
  const modelNames = connection.modelNames();

  console.log(`Syncing indexes for ${modelNames.length} collections...`);
  for (const name of modelNames) {
    const model = connection.model(name);
    await model.syncIndexes();
    console.log(`✔ ${name}`);
  }

  await app.close();
  console.log('Done.');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '../../config/config.module';

@Global()
@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
        retryAttempts: config.get<number>('database.retryAttempts', 5),
        retryDelay: config.get<number>('database.retryDelay', 2000),
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

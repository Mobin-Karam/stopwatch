import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import configuration from './configuration';
import validationSchema from './validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService, NestConfigModule],
})
export class AppConfigModule {}

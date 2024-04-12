import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { version } from '@/../package.json';
import { DbConfig } from '@/modules/app-config/configs';
import { AppConfigService, SemverVersion } from '@/modules/app-config/services';
import { validationSchema } from '@/modules/app-config/validation-schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema,
    }),
  ],
  providers: [
    {
      provide: 'APP_VERSION',
      useFactory: (): SemverVersion => version,
    },
    AppConfigService,
    DbConfig,
  ],
  exports: [
    {
      provide: 'APP_VERSION',
      useFactory: (): SemverVersion => version,
    },
    AppConfigService,
  ],
})
export class AppConfigModule {}

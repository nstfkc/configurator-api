import { Global, Module } from '@nestjs/common';
import { AbstractLogger } from '@Shared/services';
import { AppConfigService } from '@/modules/app-config/services';
import { AppConsoleLogger } from '@/modules/logger/app-console-logger';
import { LogFormat } from '@/modules/logger/enums';
import { JsonLogger } from '@/modules/logger/json-logger';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: AbstractLogger,
      useFactory: (config: AppConfigService) => {
        return config.logFormat === LogFormat.JSON
          ? new JsonLogger(config.isDev)
          : new AppConsoleLogger(config.appName);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [AbstractLogger],
})
export class LoggerModule {}

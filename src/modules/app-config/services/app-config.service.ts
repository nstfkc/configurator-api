import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/enums/env.enum';
import { DbConfig } from '@/modules/app-config/configs/db.config';
import { LogFormat } from '@/modules/logger/enums';

export type SemverVersion = string;

/**
 * @see /src/modules/app-config/validation-schema.ts for some rules
 */
@Injectable()
export class AppConfigService {
  readonly appName: string;
  readonly appVersion: SemverVersion;
  readonly port: number;
  readonly env: Env;
  readonly isDev: boolean;
  readonly isProd: boolean;
  readonly isApiDocumentationEnabled: boolean;
  readonly throttlingTtl: number;
  readonly throttlingLimit: number;
  readonly logFormat: LogFormat;

  constructor(
    @Inject('APP_VERSION') version: SemverVersion,
    readonly db: DbConfig,
    private configService: ConfigService,
  ) {
    this.env = this.configService.get<Env>('APP_ENV', Env.DEV);
    this.appName = this.configService.get<string>('APP_NAME') as string;
    this.throttlingTtl = this.configService.get<number>('APP_THROTTLING_TTL_S', 1);
    this.throttlingLimit = this.configService.get<number>('APP_THROTTLING_LIMIT', 20);
    this.logFormat = this.configService.get<LogFormat>('APP_LOG_FORMAT', LogFormat.JSON);

    this.appVersion = version;
    this.port = this.configService.get<number>('APP_PORT') as number;
    this.isDev = this.env === Env.DEV;
    this.isProd = this.env === Env.PROD;
    this.isApiDocumentationEnabled = this.isDev;
  }
}

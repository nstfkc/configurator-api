import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbConfig {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly dbName: string;
  readonly poolSize: number;
  readonly connectionTimeout: number;
  readonly deadQueryRunnerTimeout: number;
  readonly deadQueryRunnerAutoKill: boolean;

  constructor(private configService: ConfigService) {
    this.host = configService.get<string>('APP_DB_HOST', 'localhost');
    this.port = configService.get<number>('APP_DB_PORT', 5432);
    this.user = configService.get<string>('APP_DB_USER', 'postgres');
    this.password = configService.get<string>('APP_DB_PASSWORD', 'password');
    this.dbName = configService.get<string>('APP_DB_NAME', 'database');
    this.poolSize = configService.get<number>('APP_DB_POOL_SIZE', 10);
    this.connectionTimeout = configService.get<number>('APP_DB_CONNECTION_TIMEOUT_MS', 5000);
    this.deadQueryRunnerTimeout = configService.get<number>('APP_DB_DEAD_QUERY_RUNNER_TIMEOUT_MS', 5000);
    this.deadQueryRunnerAutoKill = configService.get<boolean>('APP_DB_DEAD_QUERY_RUNNER_AUTO_KILL', false);
  }
}

import { LogLevel } from '@Shared/enums';
import { RequestCtx } from '@Shared/value-objects/request-context';

export abstract class AbstractLogger {
  abstract log(data: any, level: LogLevel, prefix?: string): void;

  abstract info(data: any, prefix?: string): void;

  abstract warn(data: any, prefix?: string): void;

  abstract error(data: any, prefix?: string): void;

  abstract unexpectedError(data: any, error: any, ctx?: RequestCtx): void;

  abstract debug(data: any, prefix?: string): void;
}

import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { LogLevel } from '@Shared/enums';
import { AbstractLogger } from '@Shared/services';
import { RequestCtx } from '@Shared/value-objects/request-context';

@Injectable()
export class JsonLogger extends AbstractLogger implements LoggerService {
  private readonly _logger: Logger;

  constructor(private readonly _isDev: boolean) {
    super();
    this._logger = new Logger();
  }

  debug(data: any, prefix?: string): void {
    if (this._isDev) {
      this._log(data.toString(), LogLevel.DEBUG, prefix);
    }
  }

  error(data: any, prefix?: string): void {
    this._log(data.toString(), LogLevel.ERROR, prefix);
  }

  unexpectedError(data: any, e: any, ctx?: RequestCtx): void {
    this.error(
      [
        data.toString(),
        ctx ? `Context: ${JSON.stringify(ctx.toObject ? ctx.toObject() : { ...ctx })}` : null,
        e && e.message ? `Error message: ${e.message}.` : null,
        e && e.code ? `Error code: ${e.code}.` : null,
      ]
        .filter(Boolean)
        .join(' '),
    );
  }

  info(data: any, prefix?: string): void {
    this._log(data.toString(), LogLevel.INFO, prefix);
  }

  log(message: any, ...optionalParams: any[]): any {
    this._log(message.toString(), LogLevel.INFO);
  }

  _log(data: any, level: LogLevel, prefix?: string): void {
    const message = this._prepareMessage(data);
    const timestamp = new Date().toString();
    switch (level) {
      case LogLevel.DEBUG:
        if (this._isDev) {
          console.log(this._encode({ level, message, timestamp }));
        }
        return;
      case LogLevel.ERROR:
      case LogLevel.WARN:
      case LogLevel.INFO:
        console.log(this._encode({ level, message, timestamp }));
        break;
      default:
        const unreachableCode: never = level;
    }
  }

  warn(data: any, prefix?: string): void {
    this._log(data.toString(), LogLevel.WARN, prefix);
  }

  private _encode(data: Record<string, any>): string {
    return JSON.stringify(data);
  }

  private _prepareMessage(data: any, prefix?: string) {
    let dataString = String(data);
    if (prefix) {
      dataString = `[${prefix}] ${dataString}`;
    }
    return dataString;
  }
}

import { ConsoleLogger, Injectable } from '@nestjs/common';
import { AbstractLogger } from '@Shared/services';
import { RequestCtx } from '@Shared/value-objects/request-context';

@Injectable()
export class AppConsoleLogger extends ConsoleLogger implements AbstractLogger {
  info(data: any, prefix?: string): void {
    this.log(data.toString());
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
}

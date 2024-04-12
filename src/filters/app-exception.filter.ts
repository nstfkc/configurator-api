import { DomainException } from '@Domain/exceptions';
import { ArgumentsHost, BadRequestException, ExceptionFilter, HttpException } from '@nestjs/common';
import {
  HttpArgumentsHost,
  RpcArgumentsHost,
  WsArgumentsHost,
} from '@nestjs/common/interfaces/features/arguments-host.interface';
import { KernelException } from '@Shared/exceptions';
import { AbstractLogger } from '@Shared/services';
import { Request, Response } from 'express';
import { BaseException } from '@/exceptions';
import { httpStatusByExceptionType } from '@/exceptions/http-status-by-exception-type';
import { AppConfigService } from '@/modules/app-config/services';

export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly _logger: AbstractLogger, private readonly _config: AppConfigService) {}

  catch(e: any, host: ArgumentsHost): any {
    /** We should not receive ws context here */
    if (host.getType() === 'ws') {
      this._handleUnexpectedWsError(e, host.switchToWs());
    } else if (host.getType() === 'rpc') {
      this._handleRpcError(e, host.switchToRpc());
      return true;
    } else {
      this._handleHttpError(e, host.switchToHttp());
    }
  }

  private _handleRpcError(error: any, ctx: RpcArgumentsHost) {
    try {
      const content = JSON.stringify(ctx.getData());
      this._logger.error(`Handle rpc message error: ${error.message}. Message content: ${content}`);
    } catch (e: any) {
      this._logger.error(`Handle rpc message error: ${error.message}. Message content: unavailable`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _handleUnexpectedWsError(e: any, ctx: WsArgumentsHost) {
    // const client: Socket = ctx.getClient<Socket>();
    // const message = typeof e == 'string' ? e : e.message ?? e.toString();
    // this._logger.error(`Unexpected websocket error: ${message}`);
    // client.emit('unexpected-error', message);
    throw e;
  }

  private _handleHttpError(e: any, ctx: HttpArgumentsHost) {
    const response: any = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (e instanceof BadRequestException) {
      const res = e.getResponse() as any;
      response.status(e.getStatus()).json({
        statusCode: e.getStatus(),
        code: e.getStatus(),
        message: res.message,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(this._config.isDev ? { trace: (e.stack || '').split('\n') } : {}),
      });
    } else if (e instanceof BaseException || e instanceof DomainException || e instanceof KernelException) {
      const status = httpStatusByExceptionType(e.type);
      const metricStatus = status < 300 ? 200 : status < 500 ? 400 : 500;
      if (metricStatus === 500) {
        this._form500Response(response, request, status, e.code, e);
      } else {
        response.status(status).json({
          statusCode: status,
          code: e.code,
          message: e.message,
          timestamp: new Date().toISOString(),
          path: request.url,
          ...(this._config.isDev ? { trace: (e.stack || '').split('\n') } : {}),
        });
      }
    } else if (e instanceof HttpException) {
      const status = e.getStatus();
      const metricStatus = status < 300 ? 200 : status < 500 ? 400 : 500;
      if (metricStatus === 500) {
        this._form500Response(response, request, status, status, e);
      } else {
        response.status(e.getStatus()).json({
          statusCode: status,
          code: status,
          message: e.message,
          timestamp: new Date().toISOString(),
          path: request.url,
          ...(this._config.isDev ? { trace: (e.stack || '').split('\n') } : {}),
        });
      }
    } else {
      this._form500Response(response, request, 500, 500, e);
    }
  }

  private _form500Response(response: any, request: any, statusCode: number, code: number, e: any) {
    const message = `Unexpected error. Error code: ${e.code}. Error message: ${e.message}.`;
    this._logger.error(message);
    response.status(statusCode).json({
      statusCode,
      code,
      message: this._config.isDev ? message : `Unexpected error`,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(this._config.isDev ? { trace: (e.stack || '').split('\n') } : {}),
    });
  }
}

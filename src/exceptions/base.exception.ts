import { ExceptionType } from '@Shared/enums';
import { ExceptionCode } from '@/enums';
import { httpStatusByExceptionType } from '@/exceptions/http-status-by-exception-type';

export class BaseException extends Error {
  type: ExceptionType = ExceptionType.ERROR;
  static code: ExceptionCode = ExceptionCode.INVARIANT_VIOLATION;

  constructor(private _message: string, private _code: ExceptionCode) {
    super(_message);
  }

  get code() {
    return this._code;
  }

  toObject() {
    return {
      code: this.code,
      statusCode: httpStatusByExceptionType(this.type),
      message: this._message,
      timestamp: new Date().toISOString(),
    };
  }
}

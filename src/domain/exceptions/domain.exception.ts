import { ExceptionCode } from '@Domain/enums';
import { ExceptionType } from '@Shared/enums';

export interface DomainExceptionInterface {
  type: ExceptionType;
  code: number;
}

export class DomainException extends Error implements DomainExceptionInterface {
  static code: ExceptionCode = ExceptionCode.INVARIANT_VIOLATION;
  type: ExceptionType = ExceptionType.ERROR;

  constructor(private _message: string, private _code: ExceptionCode) {
    super(_message);
  }

  get code(): number {
    return this._code;
  }
}

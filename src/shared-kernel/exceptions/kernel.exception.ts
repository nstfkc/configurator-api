import { ExceptionCode } from '../enums/exception-code.enum';
import { ExceptionType } from '../enums/exception-type.enum';

export class KernelException extends Error {
  public $isKernelException = true;
  public type: ExceptionType = ExceptionType.ERROR;
  public static code: ExceptionCode = ExceptionCode.INVARIANT_VIOLATION;

  constructor(private _message: string, private _code: ExceptionCode) {
    super(_message);
  }

  public get code(): number {
    return this._code;
  }
}

import { ExceptionCode } from '../enums/exception-code.enum';
import { ExceptionType } from '../enums/exception-type.enum';
import { KernelException } from './kernel.exception';

export class NotFoundException extends KernelException {
  public static code: ExceptionCode = ExceptionCode.NOT_FOUND;
  public static defaultMessage = 'Not found';
  public static type: ExceptionType = ExceptionType.NOT_FOUND;
  public type: ExceptionType = ExceptionType.NOT_FOUND;

  constructor(message?: string) {
    super(`${NotFoundException.defaultMessage}${message ? ': ' + message : ''}`, NotFoundException.code);
  }
}

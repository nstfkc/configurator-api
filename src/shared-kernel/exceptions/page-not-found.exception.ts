import { ExceptionCode } from '../enums/exception-code.enum';
import { ExceptionType } from '../enums/exception-type.enum';
import { KernelException } from './kernel.exception';

export class PageNotFoundException extends KernelException {
  public static code: ExceptionCode = ExceptionCode.PAGE_NOT_FOUND;
  public static defaultMessage = 'Page not found';
  public static type: ExceptionType = ExceptionType.NOT_FOUND;
  public type: ExceptionType = ExceptionType.NOT_FOUND;

  constructor(message?: string) {
    super(`${PageNotFoundException.defaultMessage}${message ? ': ' + message : ''}`, PageNotFoundException.code);
  }
}

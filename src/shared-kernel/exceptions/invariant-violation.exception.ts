import { ExceptionCode, ExceptionType } from '@Shared/enums';
import { KernelException } from './kernel.exception';

export class InvariantViolationException extends KernelException {
  public static code: ExceptionCode = ExceptionCode.INVARIANT_VIOLATION;
  public static defaultMessage = 'Invariant violation';
  public static type: ExceptionType = ExceptionType.BAD_REQUEST;
  public type: ExceptionType = ExceptionType.BAD_REQUEST;

  constructor(message?: string) {
    super(message ? message : InvariantViolationException.defaultMessage, InvariantViolationException.code);
  }
}

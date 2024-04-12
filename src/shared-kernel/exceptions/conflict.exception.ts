import { ExceptionCode, ExceptionType } from '@Shared/enums';
import { KernelException } from './kernel.exception';

export class ConflictException extends KernelException {
  static code: ExceptionCode = ExceptionCode.CONFLICT;
  static type: ExceptionType = ExceptionType.CONFLICT;
  static defaultMessage = 'Conflict occurred';
  $isConflictException = true;
  type: ExceptionType = ExceptionType.CONFLICT;

  constructor(message: string) {
    super(message, ConflictException.code);
  }
}

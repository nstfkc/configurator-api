import { ExceptionCode } from '@Domain/enums';
import { DomainException } from '@Domain/exceptions/domain.exception';
import { ExceptionType } from '@Shared/enums';

export class UnexpectedErrorException extends DomainException {
  readonly $isUnexpectedErrorException = true;
  static code: ExceptionCode = ExceptionCode.UNEXPECTED_ERROR;
  static defaultMessage = 'Unexpected error';
  static type: ExceptionType = ExceptionType.ERROR;
  type: ExceptionType = ExceptionType.ERROR;

  constructor(message?: string) {
    super(`${UnexpectedErrorException.defaultMessage}${message ? ': ' + message : ''}`, UnexpectedErrorException.code);
  }
}

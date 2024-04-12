import { ExceptionCode } from '@Domain/enums';
import { DomainException } from '@Domain/exceptions';
import { ExceptionType } from '@Shared/enums';

export class BadRequestException extends DomainException {
  static code: ExceptionCode = ExceptionCode.BAD_REQUEST;
  static defaultMessage = 'Bad request';
  static type: ExceptionType = ExceptionType.BAD_REQUEST;
  type: ExceptionType = ExceptionType.BAD_REQUEST;

  constructor(message?: string) {
    super(`${BadRequestException.defaultMessage}${message ? ': ' + message : ''}`, BadRequestException.code);
  }
}

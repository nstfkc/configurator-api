import { ExceptionCode } from '@Domain/enums';
import { DomainException } from '@Domain/exceptions/domain.exception';
import { ExceptionType } from '@Shared/enums';

export class OperationNotPermittedException extends DomainException {
  readonly $isOperationNotPermittedException = true;
  static code: ExceptionCode = ExceptionCode.OPERATION_NOT_PERMITTED;
  static defaultMessage = 'Operation not permitted';
  static type: ExceptionType = ExceptionType.FORBIDDEN;
  type: ExceptionType = ExceptionType.FORBIDDEN;

  constructor(message?: string) {
    super(
      `${OperationNotPermittedException.defaultMessage}${message ? ': ' + message : ''}`,
      OperationNotPermittedException.code,
    );
  }
}

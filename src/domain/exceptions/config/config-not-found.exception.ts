import { ExceptionCode } from '@Domain/enums';
import { DomainException } from '@Domain/exceptions/domain.exception';
import { ExceptionType } from '@Shared/enums';

export class ConfigNotFoundException extends DomainException {
  readonly $isConfigNotFoundException = true;
  static code: ExceptionCode = ExceptionCode.CONFIG_NOT_FOUND;
  static defaultMessage = 'Config not found';
  static type: ExceptionType = ExceptionType.NOT_FOUND;
  type: ExceptionType = ExceptionType.NOT_FOUND;

  constructor(message?: string) {
    super(`${ConfigNotFoundException.defaultMessage}${message ? ': ' + message : ''}`, ConfigNotFoundException.code);
  }
}

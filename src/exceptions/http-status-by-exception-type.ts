import { ExceptionType } from '@Shared/enums';
import { InvariantViolationException } from '@Shared/exceptions';

export const httpStatusByExceptionType = (type: ExceptionType): number => {
  switch (type) {
    case ExceptionType.ERROR:
      return 500;
    case ExceptionType.EXTERNAL_ERROR:
      return 502;
    case ExceptionType.SERVICE_UNAVAILABLE:
      return 503;
    case ExceptionType.BAD_REQUEST:
      return 400;
    case ExceptionType.UNAUTHORIZED:
      return 401;
    case ExceptionType.FORBIDDEN:
      return 403;
    case ExceptionType.NOT_FOUND:
      return 404;
    case ExceptionType.CONFLICT:
      return 409;
    case ExceptionType.UNPROCESSABLE:
      return 422;
    case ExceptionType.PAYMENT_REQUIRED:
      return 402;
    default:
      // noinspection UnnecessaryLocalVariableJS
      const unreachable: never = type;
      throw new InvariantViolationException(`Unknown exception type ${unreachable}`);
  }
};

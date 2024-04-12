import { InvariantViolationException } from '@Shared/exceptions';
import { Transform } from 'class-transformer';

export function ToBoolean(allowUndefined = true): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'boolean' || (allowUndefined && value === undefined)) {
      return value;
    }
    const valueString = value.toString().toLowerCase().trim();
    const res = ['true', '1'].includes(valueString) ? true : ['false', '0'].includes(valueString) ? false : undefined;
    if (res === undefined) {
      throw new InvariantViolationException('Invalid boolean-like value');
    }
    return res;
  });
}

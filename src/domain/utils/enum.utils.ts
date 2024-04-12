import { InvariantViolationException } from '@Shared/exceptions';

export const isEnum = (enumObj: any, value: any) => {
  return Object.values(enumObj).includes(value);
};

export const checkEnum = (enumObj: any, values: any | any[], message?: string) => {
  if (!Array.isArray(values)) {
    values = [values];
  }
  values.forEach((value: any) => {
    if (!isEnum(enumObj, value)) {
      throw new InvariantViolationException(
        message ? message : `Wrong enum value "${value}", valid values are ${Object.values(enumObj).join(', ')}`,
      );
    }
  });
};

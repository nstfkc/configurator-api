import { InvariantViolationException } from '@Shared/exceptions';
import { Transform } from 'class-transformer';

export function TransformTo(valueObject: any, allowNull = false, nullValues: any[] = []): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (allowNull && (value === null || nullValues.includes(value))) {
        return null;
      }
      if (Array.isArray(value)) {
        throw new InvariantViolationException(`${valueObject.name} cannot be an array`);
      }
      return new valueObject(value);
    },
    { toClassOnly: true },
  );
}

export function TransformToArray(valueObject: any, allowNull = false, nullValues: any[] = []): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (allowNull && (value === null || nullValues.includes(value))) {
        return null;
      }
      if (!Array.isArray(value)) {
        throw new InvariantViolationException(`${valueObject.name} should be an array`);
      }
      return value.map((x) => new valueObject(x));
    },
    { toClassOnly: true },
  );
}

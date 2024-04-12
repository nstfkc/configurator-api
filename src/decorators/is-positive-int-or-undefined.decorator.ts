import { registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export function IsPositiveIntOrUndefined() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: `Значение ${propertyName} должно быть целым положительным числом` },
      validator: IsPositiveIntOrUndefinedConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isPositiveIntOrUndefined' })
export class IsPositiveIntOrUndefinedConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return (
      value === undefined ||
      (typeof value === 'number' && !isNaN(value) && parseInt(value.toString()) === value && value > 0)
    );
  }
}

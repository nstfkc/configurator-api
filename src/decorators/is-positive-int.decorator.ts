import { registerDecorator, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export function IsPositiveInt() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: `should be a integer value greater than 0` },
      validator: IsPositiveIntConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isPositiveInt' })
export class IsPositiveIntConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return (
      typeof value === 'number' && isFinite(value) && !isNaN(value) && parseInt(value.toString()) === value && value > 0
    );
  }
}

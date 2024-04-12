import { AbstractValueObject } from './abstract-value-object';
import { InvariantViolationException } from '@Shared/exceptions';

export class StringValue extends AbstractValueObject {
  $isStringValue = true;
  public readonly value: string;

  constructor(value: string, minLength = 1, maxLength = 1024) {
    super();
    if (typeof value !== 'string') {
      throw new InvariantViolationException(
        `${this.constructor.name} type should be a string, type ${typeof value} given`,
      );
    }
    this.value = (value || '').trim();
    if (this.value.length > maxLength) {
      throw new InvariantViolationException(`${this.constructor.name} should not contain more than ${maxLength} chars`);
    }
    if (this.value.length < minLength) {
      throw new InvariantViolationException(`${this.constructor.name} should not contain less than ${minLength} char`);
    }
  }

  toString(): string {
    return this.value.toString();
  }
}

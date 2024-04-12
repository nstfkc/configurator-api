import { InvariantViolationException } from '@Shared/exceptions';
import { AbstractValueObject } from './abstract-value-object';

export class NumericValue extends AbstractValueObject {
  readonly value: number;

  constructor(value: number) {
    super();
    // noinspection SuspiciousTypeOfGuard
    if (Number.isNaN(value) || !isFinite(value) || typeof value !== 'number') {
      throw new InvariantViolationException(`Wrong numeric value ${value}`);
    }
    this.value = value;
  }

  gt(x: NumericValue) {
    return this.value > x.value;
  }

  lt(x: NumericValue) {
    return this.value < x.value;
  }

  gte(x: NumericValue) {
    return this.value >= x.value;
  }

  lte(x: NumericValue) {
    return this.value <= x.value;
  }

  toString(): string {
    return this.value.toString();
  }
}

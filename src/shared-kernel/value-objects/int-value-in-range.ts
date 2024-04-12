import { InvariantViolationException } from '@Shared/exceptions';
import { AbstractNumericInRange } from '@Shared/value-objects/abstract-numeric-in-range';
import { isInteger } from 'lodash';

export class IntValueInRange extends AbstractNumericInRange {
  $isIntValueInRange = true;

  constructor(value: number, readonly min: number, readonly max: number) {
    super(value);
    if (!isInteger(value)) {
      throw new InvariantViolationException(`${this.constructor.name}: wrong integer value ${value}`);
    }
    if (!isInteger(min)) {
      throw new InvariantViolationException(`${this.constructor.name}: wrong integer min value ${value}`);
    }
    if (!isInteger(max)) {
      throw new InvariantViolationException(`${this.constructor.name}: wrong integer max value ${value}`);
    }
  }

  getMaxValue(): number {
    return this.max;
  }

  getMinValue(): number {
    return this.min;
  }
}

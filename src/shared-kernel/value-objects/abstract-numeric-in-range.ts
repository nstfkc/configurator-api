import { NumericValue } from './numeric-value';
import { InvariantViolationException } from '@Shared/exceptions';

export abstract class AbstractNumericInRange extends NumericValue {
  constructor(value: number) {
    super(value);
    const min = this.getMinValue();
    const max = this.getMaxValue();
    if (min > max) {
      throw new InvariantViolationException(
        `${this.constructor.name} minimum allowed value ${min} is greater than maximum allowed value ${max}`,
      );
    }
    if (this.value < min) {
      throw new InvariantViolationException(`${this.constructor.name} should be greater than ${min}`);
    }
    if (this.value > this.getMaxValue()) {
      throw new InvariantViolationException(`${this.constructor.name} should be less than ${max}`);
    }
  }

  abstract getMaxValue(): number;

  abstract getMinValue(): number;
}

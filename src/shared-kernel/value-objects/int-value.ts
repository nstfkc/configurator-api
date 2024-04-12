import { InvariantViolationException } from '@Shared/exceptions';
import { NumericValue } from '@Shared/value-objects/numeric-value';
import { isInteger } from 'lodash';

export class IntValue extends NumericValue {
  $isIntValue = true;

  constructor(value: number) {
    super(value);
    if (!isInteger(value)) {
      throw new InvariantViolationException(`${this.constructor.name}: wrong integer value ${value}`);
    }
  }
}

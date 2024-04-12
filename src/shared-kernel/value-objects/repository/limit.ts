import { AbstractNumericInRange } from '@Shared/value-objects';

export class Limit extends AbstractNumericInRange {
  static DEFAULT_VALUE = 25;
  static MIN_VALUE = 1;
  static MAX_VALUE = 500;

  constructor(value: string | number) {
    super(typeof value === 'string' ? Number(value) : value);
  }

  static default() {
    return new Limit(Limit.DEFAULT_VALUE);
  }

  getMaxValue(): number {
    return Limit.MAX_VALUE;
  }

  getMinValue(): number {
    return Limit.MIN_VALUE;
  }
}

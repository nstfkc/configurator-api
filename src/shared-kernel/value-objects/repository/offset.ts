import { AbstractNumericInRange } from '@Shared/value-objects';

export class Offset extends AbstractNumericInRange {
  static DEFAULT_VALUE = 0;
  static MIN_VALUE = 0;
  static MAX_VALUE = Number.MAX_SAFE_INTEGER;

  constructor(value: string | number) {
    super(typeof value === 'string' ? Number(value) : value);
  }

  static default() {
    return new Offset(Offset.DEFAULT_VALUE);
  }

  getMaxValue(): number {
    return Offset.MAX_VALUE;
  }

  getMinValue(): number {
    return Offset.MIN_VALUE;
  }
}

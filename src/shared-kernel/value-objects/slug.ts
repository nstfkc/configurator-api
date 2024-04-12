import { AbstractValueObject } from './abstract-value-object';
import { InvariantViolationException } from '@Shared/exceptions';

export type SlugString = string;

export class Slug extends AbstractValueObject {
  $isSlug = true;
  public readonly value: SlugString;
  static MAX_LENGTH = 200;
  static MIN_LENGTH = 1;

  constructor(value: string) {
    super();
    const preparedValue = value.toString().trim().toLowerCase();
    if (preparedValue.length > Slug.MAX_LENGTH || preparedValue.length < Slug.MIN_LENGTH) {
      throw new InvariantViolationException(
        `${this.constructor.name} length should be >= ${Slug.MIN_LENGTH} symbol and <= ${Slug.MAX_LENGTH}`,
      );
    }
    if (!/^[0-9a-z-_]*$/.test(preparedValue)) {
      throw new InvariantViolationException(
        `${this.constructor.name} should contain only a-Z symbols, digits, - and _ symbols: "${preparedValue}"`,
      );
    }
    this.value = preparedValue;
  }

  static sanitize(value: unknown): string {
    if (typeof value !== 'string' || !value || !value.trim()) {
      throw new InvariantViolationException(`Slug value should be a not empty string`);
    }
    const sanitized = value
      .trim()
      .toLowerCase()
      .replace(/[^0-9a-z-_]/g, '_')
      .substring(0, Slug.MAX_LENGTH);
    if (!sanitized || sanitized.length < Slug.MIN_LENGTH) {
      throw new InvariantViolationException(`Slug value should be a string with minimum length ${Slug.MIN_LENGTH}`);
    }
    return sanitized;
  }

  public toString(): string {
    return this.value;
  }
}

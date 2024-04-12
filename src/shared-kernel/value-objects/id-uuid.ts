import { InvariantViolationException } from '@Shared/exceptions';
import { v4 as uuid, validate } from 'uuid';
import { AbstractValueObject } from './abstract-value-object';

export class IdUuid extends AbstractValueObject {
  public constructor(private _value: string) {
    super();
    if (!validate(_value)) {
      throw new InvariantViolationException(`Wrong uuid value "${_value}" for ${this.constructor.name}`);
    }
  }

  get value(): string {
    return this._value;
  }

  public static id(c: IdUuid): string {
    return c.value;
  }

  public static generate<T>(c: new (value: string) => T): T {
    return new c(uuid());
  }

  eq(id: IdUuid): boolean {
    return this._value === id.value;
  }

  ne(id: IdUuid): boolean {
    return !this.eq(id);
  }

  public toString(): string {
    return this.value;
  }
}

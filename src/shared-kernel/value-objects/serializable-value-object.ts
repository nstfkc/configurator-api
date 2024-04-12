import { AbstractValueObject } from '@Shared/value-objects/abstract-value-object';

export abstract class SerializableValueObject<T> extends AbstractValueObject {
  abstract toObject(): T;

  toString() {
    return JSON.stringify(this.toObject());
  }
}

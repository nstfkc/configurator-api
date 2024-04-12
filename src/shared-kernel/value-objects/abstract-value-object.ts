export abstract class AbstractValueObject {
  eq(valueObject: AbstractValueObject): boolean {
    return this.toString() === valueObject.toString();
  }

  abstract toString(): string;
}

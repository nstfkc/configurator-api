export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly error?: string | Error,
    private readonly _value?: T,
  ) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result needs to contain an error message`);
    }
    Object.freeze(this);
  }

  public get isFailure(): boolean {
    return !this.isSuccess;
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }
    return this._value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string | Error): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }
    return Result.ok<any>();
  }
}

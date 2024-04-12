import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AbstractValueObject } from '@Shared/value-objects/abstract-value-object';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    /**
     * Requires a ValueObject with unary constructor
     */
    if (AbstractValueObject.isPrototypeOf(metatype)) {
      return value instanceof metatype ? value : new metatype(value);
    }
    const object =
      value instanceof metatype
        ? value
        : plainToInstance(metatype, value, { enableCircularCheck: true, strategy: 'exposeAll' });
    const errors = await validate(object);
    if (errors.length > 0) {
      const messages = errors.map((e: ValidationError) => {
        if (e && e.constraints) {
          return `Property ${e.property}: ${Object.values(e.constraints).join('; ')}`;
        }
        return e.toString();
      });
      throw new BadRequestException(`Validation failed. ${messages.join('. ')}`);
    }
    return object;
  }

  // eslint-disable-next-line
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * При использовании `type` как массива (например, `@ApiResourceResponse([Cat, Dog], 'Cat or dog')`)
 * к классу-контроллеру должен быть применён декоратор `@ApiExtraModels(Cat, Dog)`.
 *
 * Также можно в массиве `type` использовать `null`
 *
 * @param type
 * @param description
 * @param status
 * @constructor
 */
export const ApiResourceResponse = (type: any, description: string, status = 200) => {
  if (Array.isArray(type)) {
    const extra: any[] = [];
    const schema = {
      oneOf: type.map((x: any) => {
        if (x === null) {
          return { type: 'null' };
        } else {
          extra.push(x);
          return { $ref: getSchemaPath(x) };
        }
      }),
    };
    return applyDecorators(ApiExtraModels(...extra), ApiResponse({ status, description, schema }));
  }
  return applyDecorators(ApiResponse({ status, description, type }));
};

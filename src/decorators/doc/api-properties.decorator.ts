import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Limit, Offset } from '@Shared/value-objects';

export const ApiPropertyConst = (value: string) => applyDecorators(ApiProperty({ enum: [value] }));

export const ApiPropertyDate = (options: ApiPropertyOptions = {}) => {
  return applyDecorators(
    ApiProperty({
      type: 'string',
      format: 'date-time',
      example: '2000-01-01T00:00:00Z',
      ...options,
    }),
  );
};

export const ApiPropertyPagingPage = (options: ApiPropertyOptions = {}) => {
  return applyDecorators(
    ApiProperty({
      required: false,
      type: 'number',
      default: 1,
      minimum: 1,
      maximum: 1000000,
      description: 'Page number',
      ...options,
    }),
  );
};

export const ApiPropertyOffset = (options: ApiPropertyOptions = {}) => {
  return applyDecorators(
    ApiProperty({
      required: false,
      type: 'number',
      default: Offset.DEFAULT_VALUE,
      maximum: Offset.MAX_VALUE,
      minimum: Offset.MIN_VALUE,
      description: 'Offset',
      ...options,
    }),
  );
};

export const ApiPropertyLimit = (options: ApiPropertyOptions = {}) => {
  return applyDecorators(
    ApiProperty({
      required: false,
      type: 'number',
      default: Limit.DEFAULT_VALUE,
      maximum: Limit.MAX_VALUE,
      minimum: Limit.MIN_VALUE,
      description: 'Number of elements per page',
      ...options,
    }),
  );
};

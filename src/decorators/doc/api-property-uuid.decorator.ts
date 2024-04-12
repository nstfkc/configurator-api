import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiPropertyUuid = (options: ApiPropertyOptions = {}) => {
  return applyDecorators(ApiProperty({ type: 'string', format: 'uuid', ...options }));
};

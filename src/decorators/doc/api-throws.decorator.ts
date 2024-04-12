import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ExceptionType } from '@Shared/enums';
import { httpStatusByExceptionType } from '@/exceptions/http-status-by-exception-type';

const badRequestObj = {
  type: 'object',
  title: `Bad request`,
  properties: {
    code: { type: 'integer', enum: [400] },
    message: { type: 'string', enum: ['Validation failed. Property %s: %s'] },
    statusCode: { type: 'integer', enum: [400] },
  },
};

export const ApiThrows = (exceptions: any[], addBadRequestException = true) => {
  const groups: Record<ExceptionType, any> = exceptions.reduce((acc, e) => {
    const type = e && e.type ? e.type : ExceptionType.ERROR;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(e);
    return acc;
  }, {});
  let badRequestExceptionAdded = false;
  const decorators = (Object.keys(groups) as ExceptionType[]).map((type: ExceptionType) => {
    const e = groups[type];
    const status = httpStatusByExceptionType(type);
    const variants = e.map((exception: any) => ({
      type: 'object',
      title: `${exception.defaultMessage} [${exception.code}]`,
      properties: {
        code: { type: 'integer', enum: [exception.code] },
        message: { type: 'string', enum: [exception.defaultMessage] },
        statusCode: { type: 'integer', enum: [status] },
      },
    }));
    if (status === 400) {
      variants.push(badRequestObj);
      badRequestExceptionAdded = true;
    }
    return ApiResponse({
      status,
      description: e.map((x: any) => x.defaultMessage).join('; ') + (status === 400 ? `; ${badRequestObj.title}` : ''),
      schema: { oneOf: variants },
    });
  });
  if (addBadRequestException && !badRequestExceptionAdded) {
    decorators.push(ApiResponse({ status: 400, description: badRequestObj.title, schema: { oneOf: [badRequestObj] } }));
  }
  return applyDecorators(...decorators);
};

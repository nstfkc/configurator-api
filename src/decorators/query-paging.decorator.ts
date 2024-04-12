import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Paging } from '@Shared/value-objects';
import { Request } from 'express';

/**
 * Декоратор рассчитывает, что в req помещена информация о пользователе
 */
export const QueryPaging = createParamDecorator((data: unknown, ctx: ExecutionContext): Paging => {
  const request = ctx.switchToHttp().getRequest() as Request;
  let pageParamValue = request.query['page'];
  let limitParamValue = request.query['limit'];
  if (Array.isArray(pageParamValue)) {
    pageParamValue = pageParamValue[0];
  }
  if (Array.isArray(limitParamValue)) {
    limitParamValue = limitParamValue[0];
  }
  const page = pageParamValue ? parseInt(pageParamValue.toString()) : 1;
  const limit = limitParamValue ? parseInt(limitParamValue.toString()) : 25;
  return new Paging(page, limit);
});

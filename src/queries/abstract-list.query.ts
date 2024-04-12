import { ApiProperty } from '@nestjs/swagger';
import { OrderDirection } from '@Shared/enums/repository/order-direction.enum';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { AbstractPaginatedQuery } from './abstract-paginated.query';

export abstract class AbstractListQuery extends AbstractPaginatedQuery {
  @ApiProperty({ required: false, description: 'Filtering options' })
  @ValidateNested()
  @IsOptional()
  filter?: any;

  @ApiProperty({ required: false, description: 'Sorting field' })
  @IsOptional()
  orderBy?: string;

  @ApiProperty({ required: false, enum: OrderDirection, description: 'Sorting direction' })
  @IsEnum(OrderDirection, { message: 'Incorrect sorting direction' })
  @IsOptional()
  orderDirection?: OrderDirection;
}

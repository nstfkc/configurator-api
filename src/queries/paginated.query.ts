import { ApiProperty } from '@nestjs/swagger';
import { AbstractListQuery } from '@/queries/abstract-list.query';

export class PaginatedQuery extends AbstractListQuery {
  @ApiProperty({ required: false, description: 'Filtering options' })
  filter?: any;

  @ApiProperty({})
  orderBy?: 'string';
}

import { ApiProperty } from '@nestjs/swagger';
import { Paging } from '@Shared/value-objects';
import { AbstractResource } from './abstract.resource';

export class PaginatedResource extends AbstractResource {
  @ApiProperty({ enum: ['PaginatedResource'] })
  public readonly $resourceType!: string;

  @ApiProperty({ type: 'number', description: 'Current page' })
  public page: number;

  @ApiProperty({ type: 'number', description: 'Total entries' })
  public total: number;

  @ApiProperty({ type: 'number', description: 'Page size' })
  public limit: number;

  @ApiProperty({ type: 'number', description: 'Total pages' })
  private totalPages: number;

  constructor(paging: Paging | null, total: number) {
    super();
    this.page = paging ? paging.page : 1;
    this.limit = paging ? paging.limit : 0;
    this.totalPages = paging ? paging.pagesCount(total) : total;
    this.total = total;
  }
}

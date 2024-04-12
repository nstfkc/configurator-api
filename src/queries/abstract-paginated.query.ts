import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';
import { Paging } from 'src/shared-kernel/value-objects/repository/paging';
import { IsPositiveIntOrUndefined } from '@/decorators';
import { ApiPropertyLimit, ApiPropertyPagingPage } from '@/decorators/doc/api-properties.decorator';

export abstract class AbstractPaginatedQuery {
  @IsPositiveIntOrUndefined()
  @Type(() => Number)
  @Min(1)
  @Max(1000000)
  @IsOptional()
  @ApiPropertyPagingPage()
  public page?: number;

  @IsPositiveIntOrUndefined()
  @Type(() => Number)
  @Max(500)
  @Min(1)
  @IsOptional()
  @ApiPropertyLimit()
  public limit?: number;

  get paging(): Paging {
    return new Paging(this.page || 1, this.limit || 25);
  }
}

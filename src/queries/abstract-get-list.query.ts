import { Limit } from '@Shared/value-objects/repository/limit';
import { Offset } from '@Shared/value-objects/repository/offset';
import { IsOptional } from 'class-validator';
import { ApiPropertyLimit, ApiPropertyOffset } from '@/decorators/doc/api-properties.decorator';
import { TransformTo } from '@/decorators/validation/transform-to.decorator';

export abstract class AbstractGetListQuery {
  @IsOptional()
  @ApiPropertyLimit()
  @TransformTo(Limit)
  public limit?: Limit;

  @IsOptional()
  @ApiPropertyOffset()
  @TransformTo(Offset)
  public offset?: Offset;

  buildOffset() {
    return this.offset === undefined ? Offset.default() : this.offset;
  }

  buildLimit() {
    return this.limit === undefined ? Limit.default() : this.limit;
  }
}

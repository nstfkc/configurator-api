import { ApiProperty } from '@nestjs/swagger';
import { UuidString } from '@Shared/types';
import { IdUuid } from '@Shared/value-objects';
import { AbstractResource } from './abstract.resource';
import { ApiPropertyUuid } from '@/decorators';

export class IdResource extends AbstractResource {
  @ApiProperty({ enum: ['IdResource'] })
  public readonly $resourceType!: string;

  @ApiPropertyUuid()
  public id: UuidString;

  constructor(id: IdUuid | UuidString) {
    super();
    this.id = typeof id === 'string' ? id : id.value;
  }
}

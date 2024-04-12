import { ConfigStatus } from '@Domain/enums';
import { ApiProperty } from '@nestjs/swagger';
import { UuidString } from '@Shared/types';
import { ApiPropertyConst, ApiPropertyDate, ApiPropertyUuid } from '@/decorators';
import { ConfigModel } from '@/modules/config/models';
import { AbstractResource } from '@/resources/abstract.resource';

export class ConfigResource extends AbstractResource {
  @ApiPropertyConst('ConfigResource')
  readonly $resourceType!: string;

  @ApiPropertyUuid()
  id: UuidString;

  @ApiProperty()
  payload: Record<string, any>;

  @ApiProperty({ enum: ConfigStatus })
  status: ConfigStatus;

  @ApiPropertyDate()
  createdAt: Date;

  @ApiPropertyDate({ nullable: true })
  orderedAt: Date | null;

  @ApiPropertyDate({ nullable: true })
  updatedAt: Date | null;

  @ApiPropertyUuid({ nullable: true })
  parentId: UuidString | null;

  constructor(config: ConfigModel) {
    super();
    this.id = config.id;
    this.payload = config.payload;
    this.status = config.status;
    this.createdAt = config.createdAt;
    this.orderedAt = config.orderedAt;
    this.updatedAt = config.updatedAt;
    this.parentId = config.parentId;
  }
}

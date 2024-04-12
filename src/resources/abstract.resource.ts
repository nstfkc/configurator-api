import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractResource {
  @ApiProperty()
  public readonly $resourceType!: string;

  protected constructor() {
    this.$resourceType = this.constructor.name;
  }
}

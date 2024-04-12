import { UnexpectedErrorException } from '@Domain/exceptions';
import { Body, Controller, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictException, InvariantViolationException } from '@Shared/exceptions';
import { ApiResourceResponse, ApiThrows } from '@/decorators';
import { ApiVersion, DocumentationTag } from '@/enums';
import { CreateAConfigCommand } from '@/modules/config/commands/v1/create-a-config.command';
import { Route } from '@/modules/config/enums';
import { ConfigResource } from '@/modules/config/resources/v1/config.resource';
import { CreateConfigService } from '@/modules/config/services/create-config.service';

@ApiTags(DocumentationTag.CONFIG)
@Controller()
export class CreateAConfigController {
  constructor(private readonly _service: CreateConfigService) {}

  @ApiOperation({
    summary: `Creates a new config`,
  })
  @ApiResourceResponse(ConfigResource, 'Created config')
  @Post(Route.CREATE_CONFIG)
  @Version(ApiVersion.V1)
  @ApiThrows([InvariantViolationException, ConflictException, UnexpectedErrorException])
  async execute(@Body() command: CreateAConfigCommand): Promise<ConfigResource> {
    const result = await this._service.execute(command);
    if (result.isLeft()) {
      throw result.value;
    }
    return new ConfigResource(result.value);
  }
}

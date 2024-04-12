import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Controller, Get, Param, Version } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { InvariantViolationException } from '@Shared/exceptions';
import { UuidString } from '@Shared/types';
import { ApiResourceResponse, ApiThrows } from '@/decorators';
import { ApiVersion, DocumentationTag } from '@/enums';
import { Route } from '@/modules/config/enums';
import { ConfigResource } from '@/modules/config/resources/v1/config.resource';
import { ShowConfigService } from '@/modules/config/services/show-config.service';

@ApiTags(DocumentationTag.CONFIG)
@Controller()
export class ShowAConfigController {
  constructor(private readonly _service: ShowConfigService) {}

  @ApiOperation({
    summary: `Shows a config`,
  })
  @ApiResourceResponse(ConfigResource, 'Config info')
  @Get(Route.SHOW_CONFIG)
  @Version(ApiVersion.V1)
  @ApiThrows([ConfigNotFoundException, UnexpectedErrorException])
  @ApiParam({ name: 'configId', type: 'string', format: 'uuid', description: 'Config id' })
  async execute(@Param('configId') configId: UuidString): Promise<ConfigResource> {
    const result = await this._service.execute(configId);
    if (result.isLeft()) {
      throw result.value;
    }
    return new ConfigResource(result.value);
  }
}

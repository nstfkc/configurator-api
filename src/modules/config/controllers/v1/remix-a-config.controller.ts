import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Controller, Param, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictException } from '@Shared/exceptions';
import { UuidString } from '@Shared/types';
import { ApiResourceResponse, ApiThrows } from '@/decorators';
import { ApiVersion, DocumentationTag } from '@/enums';
import { Route } from '@/modules/config/enums';
import { ConfigResource } from '@/modules/config/resources/v1/config.resource';
import { RemixConfigService } from '@/modules/config/services/remix-config.service';

@ApiTags(DocumentationTag.CONFIG)
@Controller()
export class RemixAConfigController {
  constructor(private readonly _service: RemixConfigService) {}

  @ApiOperation({
    summary: `Creates a new config from existed one`,
  })
  @ApiResourceResponse(ConfigResource, 'Created config')
  @Post(Route.REMIX_CONFIG)
  @Version(ApiVersion.V1)
  @ApiThrows([ConflictException, ConfigNotFoundException, UnexpectedErrorException])
  async execute(@Param('configId') configId: UuidString): Promise<ConfigResource> {
    const result = await this._service.execute(configId);
    if (result.isLeft()) {
      throw result.value;
    }
    return new ConfigResource(result.value);
  }
}

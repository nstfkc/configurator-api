import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Body, Controller, Param, Put, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictException } from '@Shared/exceptions';
import { UuidString } from '@Shared/types';
import { ApiResourceResponse, ApiThrows } from '@/decorators';
import { ApiVersion, DocumentationTag } from '@/enums';
import { UpdateAConfigCommand } from '@/modules/config/commands/v1/update-a-config.command';
import { Route } from '@/modules/config/enums';
import { ConfigResource } from '@/modules/config/resources/v1/config.resource';
import { UpdateConfigService } from '@/modules/config/services/update-config.service';

@ApiTags(DocumentationTag.CONFIG)
@Controller()
export class UpdateAConfigController {
  constructor(private readonly _service: UpdateConfigService) {}

  @ApiOperation({
    summary: `Updates the config`,
  })
  @ApiResourceResponse(ConfigResource, 'Updated config')
  @Put(Route.UPDATE_CONFIG)
  @Version(ApiVersion.V1)
  @ApiThrows([ConflictException, ConfigNotFoundException, UnexpectedErrorException])
  async execute(
    @Param('configId') configId: UuidString,
    @Body() command: UpdateAConfigCommand,
  ): Promise<ConfigResource> {
    const result = await this._service.execute(configId, command);
    if (result.isLeft()) {
      throw result.value;
    }
    return new ConfigResource(result.value);
  }
}

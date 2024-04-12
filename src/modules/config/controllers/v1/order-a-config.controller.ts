import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Body, Controller, Param, Post, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictException } from '@Shared/exceptions';
import { UuidString } from '@Shared/types';
import { ApiResourceResponse, ApiThrows } from '@/decorators';
import { ApiVersion, DocumentationTag } from '@/enums';
import { Route } from '@/modules/config/enums';
import { ConfigResource } from '@/modules/config/resources/v1/config.resource';
import { OrderConfigService } from '@/modules/config/services/order-config.service';

@ApiTags(DocumentationTag.CONFIG)
@Controller()
export class OrderAConfigController {
  constructor(private readonly _service: OrderConfigService) {}

  @ApiOperation({
    summary: `Creates an order with the config`,
  })
  @ApiResourceResponse(ConfigResource, 'Updated config')
  @Post(Route.ORDER_CONFIG)
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

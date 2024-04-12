import { ConfigStatus } from '@Domain/enums';
import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@Shared/either';
import { ConflictException } from '@Shared/exceptions';
import { AbstractLogger } from '@Shared/services';
import { UuidString } from '@Shared/types';
import { DbService } from '@/modules/adapter/services';
import { ConfigModel } from '@/modules/config/models';

@Injectable()
export class OrderConfigService {
  constructor(private readonly _db: DbService, private readonly _logger: AbstractLogger) {}

  async execute(
    configId: UuidString,
  ): Promise<Either<ConfigNotFoundException | ConflictException | UnexpectedErrorException, ConfigModel>> {
    const ctx = await this._db.buildRequestContext('order-config');
    try {
      const qr = await this._db.getQueryRunner(ctx.id);
      const model = await qr.manager.findOne(ConfigModel, { where: { id: configId } });
      if (!model) {
        return left(new ConfigNotFoundException());
      }
      if (model.status !== ConfigStatus.CREATED) {
        return left(new ConflictException(`Only config in status ${ConfigStatus.CREATED} can be ordered`));
      }
      model.status = ConfigStatus.ORDERED;
      model.orderedAt = new Date();
      model.updatedAt = new Date();
      await qr.manager.save(ConfigModel, model);
      this._logger.debug(`Config ${model.id} ordered`);
      return right(model);
    } catch (e: any) {
      if (e instanceof ConfigNotFoundException) {
        return left(e);
      }
      this._logger.unexpectedError(`Can not order a config`, e);
      return left(new UnexpectedErrorException(`Can not order a config`));
    } finally {
      this._db.releaseAsync(ctx.id);
    }
  }
}

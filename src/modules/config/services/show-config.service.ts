import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@Shared/either';
import { AbstractLogger } from '@Shared/services';
import { UuidString } from '@Shared/types';
import { DbService } from '@/modules/adapter/services';
import { ConfigModel } from '@/modules/config/models';

@Injectable()
export class ShowConfigService {
  constructor(private readonly _db: DbService, private readonly _logger: AbstractLogger) {}

  async execute(
    configId: UuidString,
  ): Promise<Either<ConfigNotFoundException | UnexpectedErrorException, ConfigModel>> {
    const ctx = await this._db.buildRequestContext('show-config');
    try {
      const qr = await this._db.getQueryRunner(ctx.id);
      const model = await qr.manager.findOne(ConfigModel, { where: { id: configId } });
      if (!model) {
        return left(new ConfigNotFoundException());
      }
      return right(model);
    } catch (e: any) {
      if (e instanceof ConfigNotFoundException || e instanceof UnexpectedErrorException) {
        return left(e);
      }
      this._logger.unexpectedError(`Can not show config ${configId}`, e);
      return left(new UnexpectedErrorException(`Can not show config ${configId}`));
    } finally {
      this._db.releaseAsync(ctx.id);
    }
  }
}

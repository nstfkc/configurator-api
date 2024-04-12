import { ConfigStatus } from '@Domain/enums';
import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@Shared/either';
import { ConflictException } from '@Shared/exceptions';
import { AbstractLogger } from '@Shared/services';
import { UuidString } from '@Shared/types';
import { DbService } from '@/modules/adapter/services';
import { UpdateAConfigCommand } from '@/modules/config/commands/v1/update-a-config.command';
import { ConfigModel } from '@/modules/config/models';

@Injectable()
export class UpdateConfigService {
  constructor(private readonly _db: DbService, private readonly _logger: AbstractLogger) {}

  async execute(
    configId: UuidString,
    command: UpdateAConfigCommand,
  ): Promise<Either<ConfigNotFoundException | ConflictException | UnexpectedErrorException, ConfigModel>> {
    const ctx = await this._db.buildRequestContext('update-config');
    try {
      const qr = await this._db.getQueryRunner(ctx.id);
      const model = await qr.manager.findOne(ConfigModel, { where: { id: configId } });
      if (!model) {
        return left(new ConfigNotFoundException());
      }
      if (model.status !== ConfigStatus.CREATED) {
        return left(new ConflictException(`Only config in status ${ConfigStatus.CREATED} can be updated`));
      }
      model.payload = command.payload;
      model.updatedAt = new Date();
      await qr.manager.save(ConfigModel, model);
      this._logger.debug(`Config ${model.id} updated`);
      return right(model);
    } catch (e: any) {
      if (
        e instanceof ConfigNotFoundException ||
        e instanceof ConflictException ||
        e instanceof UnexpectedErrorException
      ) {
        return left(e);
      }
      this._logger.unexpectedError(`Can not update config ${configId}`, e);
      return left(new UnexpectedErrorException(`Can not update config ${configId}`));
    } finally {
      this._db.releaseAsync(ctx.id);
    }
  }
}

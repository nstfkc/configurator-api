import { ConfigStatus } from '@Domain/enums';
import { UnexpectedErrorException } from '@Domain/exceptions';
import { ConfigNotFoundException } from '@Domain/exceptions/config/config-not-found.exception';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@Shared/either';
import { ConflictException } from '@Shared/exceptions';
import { AbstractLogger } from '@Shared/services';
import { UuidString } from '@Shared/types';
import { v4 as uuid } from 'uuid';
import { DbService } from '@/modules/adapter/services';
import { ConfigModel } from '@/modules/config/models';

@Injectable()
export class RemixConfigService {
  constructor(private readonly _db: DbService, private readonly _logger: AbstractLogger) {}

  async execute(
    configId: UuidString,
  ): Promise<Either<ConfigNotFoundException | ConflictException | UnexpectedErrorException, ConfigModel>> {
    const ctx = await this._db.buildRequestContext('remix-config');
    try {
      const qr = await this._db.getQueryRunner(ctx.id);
      const model = await qr.manager.findOne(ConfigModel, { where: { id: configId } });
      if (!model) {
        return left(new ConfigNotFoundException());
      }
      if (model.status !== ConfigStatus.ORDERED) {
        return left(
          new ConflictException(
            `Can not create a new config from config ${model.id} in status ${ConfigStatus.ORDERED}`,
          ),
        );
      }
      const remix = new ConfigModel();
      remix.id = uuid();
      remix.payload = model.payload;
      remix.updatedAt = null;
      remix.orderedAt = null;
      remix.createdAt = new Date();
      remix.status = ConfigStatus.CREATED;
      remix.parentId = model.id;
      await qr.manager.save(ConfigModel, remix);
      this._logger.debug(`Remix ${remix.id} from config ${model.id} created`);
      return right(remix);
    } catch (e: any) {
      if (
        e instanceof ConfigNotFoundException ||
        e instanceof ConflictException ||
        e instanceof UnexpectedErrorException
      ) {
        return left(e);
      }
      this._logger.unexpectedError(`Can not remix config ${configId}`, e);
      return left(new UnexpectedErrorException(`Can not remix config ${configId}`));
    } finally {
      this._db.releaseAsync(ctx.id);
    }
  }
}

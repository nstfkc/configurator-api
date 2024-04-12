import { ConfigStatus } from '@Domain/enums';
import { UnexpectedErrorException } from '@Domain/exceptions';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@Shared/either';
import { PostgresExceptionCode } from '@Shared/enums';
import { ConflictException, InvariantViolationException } from '@Shared/exceptions';
import { AbstractLogger } from '@Shared/services';
import { v4 as uuid } from 'uuid';
import { DbService } from '@/modules/adapter/services';
import { CreateAConfigCommand } from '@/modules/config/commands/v1/create-a-config.command';
import { ConfigModel } from '@/modules/config/models';

@Injectable()
export class CreateConfigService {
  constructor(private readonly _db: DbService, private readonly _logger: AbstractLogger) {}

  async execute(
    command: CreateAConfigCommand,
  ): Promise<Either<InvariantViolationException | ConflictException | UnexpectedErrorException, ConfigModel>> {
    const ctx = await this._db.buildRequestContext('create-config');
    try {
      const qr = await this._db.getQueryRunner(ctx.id);
      const model = new ConfigModel();
      model.id = uuid();
      model.createdAt = new Date();
      model.status = ConfigStatus.CREATED;
      model.payload = command.payload;
      model.orderedAt = null;
      model.updatedAt = null;
      model.parentId = null;
      await qr.manager.insert(ConfigModel, model);
      this._logger.debug(`Config ${model.id} created`);
      return right(model);
    } catch (e: any) {
      if (e instanceof InvariantViolationException) {
        return left(e);
      }
      if (e?.code === PostgresExceptionCode.UNIQUE_VIOLATION) {
        this._logger.unexpectedError(`Can not create a config: already exists`, e);
        return left(new ConflictException(`Can not create a config: already exists`));
      }
      this._logger.unexpectedError(`Can not create a config`, e);
      return left(new UnexpectedErrorException(`Can not create a config`));
    } finally {
      this._db.releaseAsync(ctx.id);
    }
  }
}

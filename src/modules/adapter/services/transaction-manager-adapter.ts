import { TransactionIsolationLevel } from '@Domain/enums';
import { TransactionManagerService } from '@Domain/services';
import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '@Shared/services';
import { RequestCtx } from '@Shared/value-objects/request-context';
import { v4 as uuid } from 'uuid';
import { DbService } from '@/modules/adapter/services';

@Injectable()
export class TransactionManagerAdapter implements TransactionManagerService {
  constructor(private readonly _db: DbService, private readonly _logger: AbstractLogger) {}

  async begin(id?: string, transactionIsolationLevel?: TransactionIsolationLevel): Promise<string> {
    const queryRunnerId = id ? id : uuid().split('-')[0];
    await this._db.startTransaction(queryRunnerId, transactionIsolationLevel);
    return queryRunnerId;
  }

  async commit(queryRunnerId: string): Promise<void> {
    await this._db.commitTransaction(queryRunnerId);
    await this.release(queryRunnerId);
  }

  async rollback(queryRunnerId: string): Promise<void> {
    await this._db.rollbackTransaction(queryRunnerId);
    await this.release(queryRunnerId);
  }

  async release(idOrContext: RequestCtx | string): Promise<void> {
    await this._db.release(idOrContext);
  }

  releaseAsync(idOrContext: RequestCtx | string): void {
    this._db.release(idOrContext).catch((e: any) => {
      this._logger.error(`TransactionManagerAdapter: Release error: ${e.message}`);
    });
  }

  async buildRequestContext(prefix?: string): Promise<RequestCtx> {
    return this._db.buildRequestContext(prefix);
  }
}

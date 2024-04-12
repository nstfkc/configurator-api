import { TransactionIsolationLevel } from '@Domain/enums';
import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '@Shared/services';
import { RequestCtx } from '@Shared/value-objects/request-context';
import { DataSource, getConnectionManager, QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AppConfigService } from '@/modules/app-config/services';

export enum QueryRunnerState {
  NONE,
  TRANSACTION_STARTED,
  TRANSACTION_COMMITTED,
  TRANSACTION_ROLLED_BACK,
}

@Injectable()
export class DbService {
  constructor(
    private readonly _logger: AbstractLogger,
    private readonly _config: AppConfigService,
    private readonly _dataSource: DataSource,
  ) {}

  private _runners: Record<string, QueryRunner> = {};
  private _state: Record<string, QueryRunnerState> = {};

  buildRequestContext(prefix?: string): RequestCtx {
    return { id: `${prefix ? prefix + '-' : ''}${uuid().split('-')[0]}` } as RequestCtx;
  }

  async getQueryRunner(queryRunnerId: string, connectionName = 'default'): Promise<QueryRunner> {
    if (this._runners[queryRunnerId]) {
      const queryRunner = this._runners[queryRunnerId];
      if (!queryRunner.isReleased) {
        return queryRunner;
      }
      await this._removeQueryRunner(queryRunnerId);
    }
    this._runners[queryRunnerId] = await this._buildQueryRunner(queryRunnerId, connectionName);
    this._state[queryRunnerId] = QueryRunnerState.NONE;
    return this._runners[queryRunnerId];
  }

  async startTransaction(
    idOrContext: string | RequestCtx,
    transactionIsolationLevel?: TransactionIsolationLevel,
  ): Promise<void> {
    const queryRunnerId = typeof idOrContext === 'string' ? idOrContext : idOrContext.id;
    const queryRunner = await this.getQueryRunner(queryRunnerId);
    if (queryRunner) {
      if (this._state[queryRunnerId] === QueryRunnerState.TRANSACTION_STARTED) {
        this._logger.error(`QueryRunner ${queryRunnerId} already has active transaction`);
        return;
      } else {
        const isolationLevel =
          transactionIsolationLevel == TransactionIsolationLevel.SERIALIZABLE ? 'SERIALIZABLE' : 'READ COMMITTED';
        await queryRunner.startTransaction(isolationLevel);
        this._state[queryRunnerId] = QueryRunnerState.TRANSACTION_STARTED;
      }
    }
  }

  async rollbackTransaction(idOrContext: string | RequestCtx): Promise<void> {
    const queryRunnerId = typeof idOrContext === 'string' ? idOrContext : idOrContext.id;
    if (this._runners[queryRunnerId]) {
      const queryRunner = this._runners[queryRunnerId];
      if (this._state[queryRunnerId] !== QueryRunnerState.TRANSACTION_STARTED) {
        this._logger.error(`Rollback failed: QueryRunner ${queryRunnerId} as no active transaction`);
        return;
      }
      await queryRunner.rollbackTransaction();
      this._state[queryRunnerId] = QueryRunnerState.TRANSACTION_ROLLED_BACK;
    } else {
      this._logger.error(`Rollback failed: QueryRunner ${queryRunnerId} not found`);
    }
  }

  async commitTransaction(idOrContext: string | RequestCtx): Promise<void> {
    const queryRunnerId = typeof idOrContext === 'string' ? idOrContext : idOrContext.id;
    if (this._runners[queryRunnerId]) {
      const queryRunner = this._runners[queryRunnerId];
      if (this._state[queryRunnerId] !== QueryRunnerState.TRANSACTION_STARTED) {
        this._logger.error(`Commit failed: QueryRunner ${queryRunnerId} has no active transaction`);
        return;
      }
      if (!queryRunner.isTransactionActive) {
        this._logger.error(`Commit failed: QueryRunner ${queryRunnerId} has no active transaction`);
        return;
      } else if (queryRunner.isReleased) {
        this._logger.error(`Commit failed: QueryRunner ${queryRunnerId} is released`);
        return;
      } else {
        await queryRunner.commitTransaction();
      }
      this._state[queryRunnerId] = QueryRunnerState.TRANSACTION_COMMITTED;
    } else {
      this._logger.error(`Commit failed: QueryRunner ${queryRunnerId} not found`);
    }
  }

  releaseAsync(idOrContext: string | RequestCtx): void {
    this.release(idOrContext).catch((e: any) => {
      this._logger.error(`DbService: Release error: ${e.message}`);
    });
  }

  async release(idOrContext: string | RequestCtx): Promise<boolean> {
    const queryRunnerId = typeof idOrContext === 'string' ? idOrContext : idOrContext.id;
    if (this._runners[queryRunnerId]) {
      const queryRunner = this._runners[queryRunnerId];
      if (queryRunner.isTransactionActive || this._state[queryRunnerId] === QueryRunnerState.TRANSACTION_STARTED) {
        this._logger.error(
          `Release failed: QueryRunner ${queryRunnerId} has active transaction, please commit or rollback transaction first`,
        );
      }
      if (queryRunner.isReleased) {
        this._logger.debug(`Release failed: QueryRunner ${queryRunnerId} already released`);
      } else {
        await queryRunner.release();
      }
      await this._removeQueryRunner(queryRunnerId);
      return true;
    }
    return false;
  }

  private async _removeQueryRunner(queryRunnerId: string): Promise<void> {
    if (this._runners[queryRunnerId]) {
      delete this._runners[queryRunnerId];
    }
    if (this._state[queryRunnerId]) {
      delete this._state[queryRunnerId];
    }
  }

  private async _buildQueryRunner(queryRunnerId: string, connectionName: string): Promise<QueryRunner> {
    try {
      const queryRunner = await this._tryConnect();
      this._startAutoKillTask(queryRunnerId, connectionName);
      return queryRunner;
    } catch (e: any) {
      this._logger.error(
        `Build query runner ${queryRunnerId} for connection name ${connectionName} failed: ${e.message}`,
      );
      throw new Error(`Can not obtain database connection for query runner ${queryRunnerId}`);
    }
  }

  private _startAutoKillTask(queryRunnerId: string, connectionName: string) {
    const timeout = this._config.db.deadQueryRunnerTimeout;
    setTimeout(() => {
      if (getConnectionManager().has(connectionName) && this._runners[queryRunnerId]) {
        if (this._config.db.deadQueryRunnerAutoKill) {
          this.release(queryRunnerId)
            .then((wasReleased: boolean) => {
              if (wasReleased) {
                this._logger.error(`Dead QueryRunner ${queryRunnerId} was released after timeout ${timeout}ms`);
              }
            })
            .catch((e: any) => {
              this._logger.error(`Can not release dead QueryRunner ${queryRunnerId}: ${e.toString()}`);
            });
        } else {
          this._logger.error(`Dead QueryRunner ${queryRunnerId} was found but auto release is not enabled`);
        }
      }
    }, timeout);
  }

  private _tryConnect(): Promise<QueryRunner> {
    return new Promise(async (resolve, reject) => {
      const attempts = 5;
      const tryFunction = async (attempt: number) => {
        let queryRunner: QueryRunner | undefined = undefined;
        try {
          queryRunner = this._dataSource.createQueryRunner();
          // queryRunner = connection.createQueryRunner();
          await queryRunner.connect();
          resolve(queryRunner);
        } catch (e: any) {
          setTimeout(async () => {
            if (attempt < attempts) {
              await tryFunction(attempt + 1);
            } else {
              if (queryRunner && !queryRunner.isReleased) {
                await queryRunner.release();
              }
              reject(new Error('Can not obtain connection'));
            }
          }, 200);
        }
      };
      await tryFunction(0);
    });
  }
}

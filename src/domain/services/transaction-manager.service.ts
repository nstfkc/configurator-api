import { TransactionIsolationLevel } from '@Domain/enums';
import { RequestCtx } from '@Shared/value-objects/request-context';

export abstract class TransactionManagerService {
  /**
   * @param {string} [id] Transaction id. Should be used to rollback/commit.
   * @param transactionIsolationLevel
   * @returns {string} Transaction id
   */
  abstract begin(id?: string, transactionIsolationLevel?: TransactionIsolationLevel): Promise<string>;

  abstract commit(id: string): Promise<void>;

  abstract rollback(id: string): Promise<void>;

  abstract release(id: RequestCtx | string): Promise<void>;

  abstract releaseAsync(id: RequestCtx | string): void;

  abstract buildRequestContext(prefix?: string): Promise<RequestCtx>;
}

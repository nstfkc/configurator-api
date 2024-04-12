import { Paging } from './paging';

export class PaginatedData<T> {
  public readonly paging: Paging;

  constructor(public readonly data: T[], paging: Paging | null, public readonly total: number) {
    this.paging = paging ? paging : new Paging(1, Math.max(total, 1));
    this.paging.check(total);
  }

  public hasNextPage(): boolean {
    return this.paging.hasNext(this.total);
  }

  public hasPrevPage(): boolean {
    return this.paging.hasPrev();
  }
}

import { InvariantViolationException, PageNotFoundException } from '@Shared/exceptions';

export class Paging {
  constructor(public readonly page: number, public readonly limit: number) {
    if (page < 1) {
      throw new InvariantViolationException('Page number can not be less than 1');
    }
    if (limit < 1) {
      throw new InvariantViolationException('Limit can not be less than 1');
    }
  }

  static first(): Paging {
    return new Paging(1, 25);
  }

  check(total: number) {
    if (isNaN(total) || total < 0) {
      throw new InvariantViolationException(`Wrong total`);
    }
    if (total > 0 && this.page > this.pagesCount(total)) {
      throw new PageNotFoundException(`Page number ${this.page} with limit ${this.limit} not found for total ${total}`);
    }
  }

  pagesCount(total: number) {
    return Math.ceil(total / this.limit);
  }

  get skip() {
    return this.prevPage * this.limit;
  }

  get offset() {
    return this.skip;
  }

  get take() {
    return this.limit;
  }

  next(): Paging {
    return new Paging(this.nextPage, this.limit);
  }

  prev(): Paging {
    return new Paging(this.prevPage, this.limit);
  }

  private get prevPage(): number {
    return this.page - 1;
  }

  private get nextPage(): number {
    return this.page + 1;
  }

  hasPrev(): boolean {
    return this.page > 1;
  }

  hasNext(total: number): boolean {
    return this.nextPage <= this.pagesCount(total);
  }
}

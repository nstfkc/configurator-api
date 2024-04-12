import { Injectable } from '@nestjs/common';
import { DbService } from '@/modules/adapter/services';

@Injectable()
export class TestSeeder {
  constructor(private readonly _db: DbService) {}

  async seedData(): Promise<void> {
    const ctx = await this._db.buildRequestContext('seed-data');
    try {
      const qr = await this._db.getQueryRunner(ctx.id);
      await qr.manager.query(`
      -- nothing to do yet
      `);
    } finally {
      this._db.releaseAsync(ctx.id);
    }
  }
}

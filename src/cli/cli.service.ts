import { Command, Console } from 'nestjs-console';
import { TestSeeder } from '@/database/seeders/test-seeder';
import { DbService } from '@/modules/adapter/services';

@Console()
export class CliService {
  constructor(private readonly _db: DbService) {}

  @Command({
    command: 'clean-db',
    description: 'Cleans the database: drops schemas, truncates migration table',
  })
  async cleanDb() {
    const ctx = await this._db.buildRequestContext('clean-db');
    try {
      const qr = await this._db.getQueryRunner(ctx.id);
      const schemas = ['configurator'];
      await qr.manager.query(schemas.map((x) => `drop schema if exists ${x} cascade;`).join(''));
      try {
        await qr.manager.query(`truncate table public.migrations;`);
      } catch (e: any) {
        console.log('-----------------------------------------------');
        console.log('[WARN] Table `public.migrations` does not exist');
        console.log('-----------------------------------------------');
      }
      console.log(`Schemas ${schemas.join(', ')} were dropped`);
      console.log('Table `public.migrations` was truncated');
    } finally {
      this._db.releaseAsync(ctx.id);
    }
  }

  @Command({ command: 'seed', description: 'Seeds test data' })
  async seedUsers() {
    const seeder = new TestSeeder(this._db);
    console.log('SEEDING TEST DATA');
    await seeder.seedData();
    console.log('DONE!');
  }
}

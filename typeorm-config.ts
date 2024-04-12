import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

const path = '.env';
if (fs.existsSync(path)) {
  dotenv.config({ path });
}

const connectTimeoutMS = process.env.APP_DB_CONNECTION_TIMEOUT_MS
  ? parseInt(process.env.APP_DB_CONNECTION_TIMEOUT_MS)
  : 5000;
const poolSize = process.env.APP_DB_POOL_SIZE
  ? parseInt(process.env.APP_DB_POOL_SIZE)
  : 100;

const host = process.env.APP_DB_HOST || 'localhost';
const port = process.env.APP_DB_PORT ? parseInt(process.env.APP_DB_PORT as string) : 5432;
const username = process.env.APP_DB_USER || 'postgres';
const password = process.env.APP_DB_PASSWORD || 'password';
const database = process.env.APP_DB_NAME || 'database';

export default new DataSource({
  applicationName: 'marketmaker-admin-api',
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  logging: false,
  connectTimeoutMS,
  // retryAttempts: 20,
  // retryDelay: 100,
  extra: {
    poolSize,
    allowExitOnIdle: true,
    idleTimeoutMillis: 10000,
    options: '-c lock_timeout=10000ms',
    statement_timeout: 10000,
  },
});
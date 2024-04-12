import * as Joi from 'joi';
import { Env } from '@/enums/env.enum';
import { LogFormat } from '@/modules/logger/enums';

const JoiBoolean = Joi.boolean().falsy('');

export const validationSchema = Joi.object({
  /**
   * Common
   */
  APP_ENV: Joi.string().valid(Env.DEV, Env.PROD).default(Env.DEV),
  APP_NAME: Joi.string().required(),
  APP_PORT: Joi.number().port().optional().default(7000),
  /**
   * Logging
   */
  APP_LOG_FORMAT: Joi.string().valid(LogFormat.JSON, LogFormat.CONSOLE).default(LogFormat.JSON),
  /**
   * Throttling
   */
  APP_THROTTLING_TTL_S: Joi.number().positive().optional().default(1),
  APP_THROTTLING_LIMIT: Joi.number().positive().optional().default(20),
  /**
   * Database
   */
  APP_DB_HOST: Joi.string().required(),
  APP_DB_PORT: Joi.number().port().required(),
  APP_DB_PASSWORD: Joi.string().required(),
  APP_DB_USER: Joi.string().required(),
  APP_DB_NAME: Joi.string().required(),
  APP_DB_POOL_SIZE: Joi.number().integer().min(0).optional().default(10),
  APP_DB_CONNECTION_TIMEOUT_MS: Joi.number().integer().min(0).optional().default(5000),
  APP_DB_DEAD_QUERY_RUNNER_TIMEOUT_MS: Joi.number().integer().min(0).optional().default(25000),
  APP_DB_DEAD_QUERY_RUNNER_AUTO_KILL: JoiBoolean.optional().default(false),
});

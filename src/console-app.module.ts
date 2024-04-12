import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { CliService } from '@/cli/cli.service';
import { AdapterModule } from '@/modules/adapter/adapter.module';
import { AppConfigService } from '@/modules/app-config/services';
import { LoggerModule } from '@/modules/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    AppConfigModule,
    AdapterModule,
    ConsoleModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.user,
        password: config.db.password,
        database: config.db.dbName,
        entities: [__dirname + `/**/*.model{.ts,.js}`],
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
  controllers: [],
  providers: [CliService],
  exports: [],
})
export class ConsoleAppModule {}

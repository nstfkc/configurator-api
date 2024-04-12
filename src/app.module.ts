import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdapterModule } from '@/modules/adapter/adapter.module';
import { AppConfigModule } from '@/modules/app-config/app-config.module';
import { AppConfigService } from '@/modules/app-config/services';
import { ConfigModule } from '@/modules/config/config.module';
import { LoggerModule } from '@/modules/logger/logger.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    ThrottlerModule.forRootAsync({
      useFactory: (config: AppConfigService) => ({
        ttl: config.throttlingTtl,
        limit: config.throttlingLimit,
      }),
      inject: [AppConfigService],
    }),
    AdapterModule,
    LoggerModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

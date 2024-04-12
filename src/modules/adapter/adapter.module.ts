import { TransactionManagerService } from '@Domain/services';
import { Global, Module } from '@nestjs/common';
import { DbService } from '@/modules/adapter/services';
import { TransactionManagerAdapter } from '@/modules/adapter/services/transaction-manager-adapter';

const services = [[TransactionManagerService, TransactionManagerAdapter]] as any[];

@Global()
@Module({
  imports: [],
  providers: [DbService, ...services.map(([provide, useClass]) => ({ provide, useClass }))],
  exports: [DbService, ...services.map(([provide]) => provide)],
})
export class AdapterModule {}

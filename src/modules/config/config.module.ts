import { Module } from '@nestjs/common';
import { controllers } from '@/modules/config/controllers/v1/controllers';
import { CreateConfigService } from '@/modules/config/services/create-config.service';
import { OrderConfigService } from '@/modules/config/services/order-config.service';
import { RemixConfigService } from '@/modules/config/services/remix-config.service';
import { ShowConfigService } from '@/modules/config/services/show-config.service';
import { UpdateConfigService } from '@/modules/config/services/update-config.service';

@Module({
  controllers,
  imports: [],
  providers: [CreateConfigService, ShowConfigService, OrderConfigService, UpdateConfigService, RemixConfigService],
  exports: [],
})
export class ConfigModule {}

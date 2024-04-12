import { CreateAConfigController } from '@/modules/config/controllers/v1/create-a-config.controller';
import { OrderAConfigController } from '@/modules/config/controllers/v1/order-a-config.controller';
import { RemixAConfigController } from '@/modules/config/controllers/v1/remix-a-config.controller';
import { ShowAConfigController } from '@/modules/config/controllers/v1/show-a-config.controller';
import { UpdateAConfigController } from '@/modules/config/controllers/v1/update-a-config.controller';

export const controllers = [
  CreateAConfigController,
  ShowAConfigController,
  OrderAConfigController,
  UpdateAConfigController,
  RemixAConfigController,
];

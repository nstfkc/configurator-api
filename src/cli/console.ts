import { BootstrapConsole } from 'nestjs-console';
import { ConsoleAppModule } from '@/console-app.module';

const bootstrap = new BootstrapConsole({
  module: ConsoleAppModule,
  useDecorators: true,
});

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    await app.close();
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});

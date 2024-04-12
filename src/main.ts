import { INestApplication, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AbstractLogger, LocatorService } from '@Shared/services';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { ApiVersion, DocumentationTag } from '@/enums';
import { AppExceptionFilter } from '@/filters';
import { ServiceContainerAdapter } from '@/modules/adapter/shared-kernel';
import { AppConfigService } from '@/modules/app-config/services';
import { ValidationPipe } from '@/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);
  const logger = app.get(AbstractLogger);
  app.useLogger(logger);
  const port = config.port;
  const containerAdapter = new ServiceContainerAdapter(
    (token: any) => app.get(token),
    (token: any) => app.resolve(token),
  );
  LocatorService.setContainer(containerAdapter);
  setupVersioning(app);
  await setupDocumentation(app, config, logger);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    origin: true,
  });
  app.use(bodyParser.json({ limit: `1mb` }));
  app.use(bodyParser.urlencoded({ limit: `1mb`, extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AppExceptionFilter(logger, config));
  await app.listen(port);
  logger.info(`Starting at port ${port}`);
}

async function setupDocumentation(app: INestApplication, config: AppConfigService, logger: AbstractLogger) {
  if (!config.isApiDocumentationEnabled) {
    logger.warn(`Documentation is disabled`);
    return;
  }
  const documentConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(config.appName)
    .setDescription(`${config.appName} documentation`)
    .setVersion(ApiVersion.V1)
    .addTag(DocumentationTag.CONFIG, 'Config')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup(`docs/v${ApiVersion.V1}`, app, document);
}

function setupVersioning(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
  });
}

bootstrap();

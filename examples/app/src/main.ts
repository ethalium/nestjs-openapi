import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { OpenApiModule } from '../../../lib/openapi.module';
import { ErrorResponse, SuccessResponse } from './main.types';
import { RbacTransformer } from './main.rbac';
import { writeFileSync } from 'node:fs';

async function bootstrap() {

  // create application
  const app = await NestFactory.create(MainModule, {
    // logger: false,
  });

  // create document builder
  const builder = OpenApiModule.createDocumentBuilder({
    title: 'Example App',
    description: 'The Example App API description',
    version: '1.0',
  });

  // create document
  const document = OpenApiModule.createDocument(app, builder.build(), {
    //convertTo: '3.1.0',
    responseOverrides: {
      '2XX': [SuccessResponse, 'data'],
      'serverError': ErrorResponse
    },
    transformers: [
      RbacTransformer
    ]
  });

  // setup swagger
  SwaggerModule.setup('swagger', app, document);

  // setup scalar
  app.use('/scalar', apiReference({
    content: document,
    expandAllResponses: true,
    darkMode: true,
    hideClientButton: true,
    hiddenClients: true,
    hideDarkModeToggle: true,
    hideTestRequestButton: true,
    showDeveloperTools: 'never',
    persistAuth: true,
    telemetry: true,
    layout: 'modern',
    documentDownloadType: 'both',
    orderSchemaPropertiesBy: 'preserve',
    orderRequiredPropertiesFirst: true,
    showOperationId: false,
  }));

  // start application
  await app.listen(process.env.port ?? 3000);

}

bootstrap();

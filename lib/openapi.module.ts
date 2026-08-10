import type { IOpenApiDocumentBuilder } from './utils/document-builder.utils';
import { OpenApiDocumentBuilder } from './utils/document-builder.utils';
import type { INestApplication } from '@nestjs/common';
import { Module } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import type { IOpenApiDocumentOptions, OpenApiDocument } from './interfaces/document.interface';
import { OpenApiBuilder } from './openapi.builder';
import { OpenApiTransformer } from './openapi.transformer';
import { OpenApiScanner } from './openapi.scanner';


@Module({})
export class OpenApiModule {

  /**
   * Creates and returns a new instance of OpenApiDocumentBuilder.
   *
   * @param {IOpenApiDocumentBuilder} [options] - Optional configuration for the OpenApiDocumentBuilder instance.
   * @return {OpenApiDocumentBuilder} A new instance of OpenApiDocumentBuilder.
   */
  static createDocumentBuilder(options?: IOpenApiDocumentBuilder): OpenApiDocumentBuilder {
    return new OpenApiDocumentBuilder(options);
  }

  /**
   * Creates an OpenAPI document using the provided application, configuration, and options.
   *
   * @param {INestApplication} app - The NestJS application instance used to generate the OpenAPI document.
   * @param {Omit<OpenApiDocument, 'paths'>} config - The base configuration for the OpenAPI document, excluding paths.
   * @param {IOpenApiDocumentOptions} [options] - Optional configurations for generating and transforming the OpenAPI document.
   * @return {OpenAPIObject} The generated and transformed OpenAPI document object.
   */
  static createDocument(app: INestApplication, config: Omit<OpenApiDocument, 'paths'>, options?: IOpenApiDocumentOptions): OpenAPIObject {

    // build options
    const documentOptions: IOpenApiDocumentOptions = Object.assign(options || {}, {
      autoTagControllers: options?.autoTagControllers ?? false, // we want to disable autotagging by default.
    });

    // create scanner
    const scanner = new OpenApiScanner(app);

    // create builder
    const builder = new OpenApiBuilder(scanner, config, documentOptions);

    // build document
    const document = SwaggerModule.createDocument(app, builder.build(), documentOptions);

    // transform and return document
    return (new OpenApiTransformer(scanner, documentOptions?.transformers || [])).transform(document);

  }

}
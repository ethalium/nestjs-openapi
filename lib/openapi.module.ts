import {IOpenApiDocumentBuilder, OpenApiDocumentBuilder} from "./utils/document-builder.utils";
import {INestApplication, Module} from "@nestjs/common";
import {OpenAPIObject, SwaggerModule} from "@nestjs/swagger";
import {IOpenApiDocumentOptions, OpenApiDocument} from "./interfaces/document.interface";
import {OpenApiBuilder} from "./openapi.builder";


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
   * Creates and returns a new OpenApiDocument instance based on the provided application, configuration, and options.
   *
   * @param {INestApplication} app - The NestJS application instance for which the document is generated.
   * @param {Omit<OpenAPIObject, 'paths'>} config - The configuration object for the OpenAPI document, excluding the 'paths' property.
   * @param {IOpenApiDocumentOptions} [options] - Optional settings to customize the generated OpenApiDocument.
   * @return {OpenApiDocument} A new OpenApiDocument instance generated using the provided parameters.
   */
  static createDocument(app: INestApplication, config: Omit<OpenApiDocument, 'paths'>, options?: IOpenApiDocumentOptions): OpenAPIObject {
    const builder = new OpenApiBuilder(app, config, options || {});
    return SwaggerModule.createDocument(app, builder.build(), Object.assign(options || {}, {
      autoTagControllers: options?.autoTagControllers ?? false, // we want to disable autotagging by default.
    }));
  }

}
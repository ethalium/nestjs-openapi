import type { IOpenApiBodyOptions } from './body.interface';
import type { RequestMappingMetadata } from '@nestjs/common/decorators/http/request-mapping.decorator';
import type { IOpenApiRequestOptions } from './request.interface';
import type { IOpenApiDecoratorOptions, IOpenApiResponseOptions, IOpenApiResponseType } from './common.interface';
import type { ExternalDocumentationObject, SecurityRequirementObject, ServerObject } from '@nestjs/swagger';

export interface IOpenApiRouteOptions extends IOpenApiRequestOptions, Omit<RequestMappingMetadata, 'method'>, IOpenApiDecoratorOptions {

  /**
   * OpenAPI exclude
   * @invokes @ApiExcludeEndpoint
   */
  exclude?: boolean;

  /**
   * OpenAPI Summary
   * @invokes @ApiOperation
   */
  summary?: string;
  description?: string;
  operationId?: string;
  externalDocs?: ExternalDocumentationObject;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];

  /**
   * OpenAPI Response
   * @invokes @OABody
   */
  body?: IOpenApiBodyOptions;

  /**
   * OpenAPI Response
   * @invokes @OAOkResponse | @OACreatedResponse
   */
  response?: IOpenApiResponseType | IOpenApiResponseOptions;

}
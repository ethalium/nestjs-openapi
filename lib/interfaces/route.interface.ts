import {ExternalDocumentationObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {IOpenApiBodyOptions} from "./body.interface";
import {RequestMappingMetadata} from "@nestjs/common/decorators/http/request-mapping.decorator";
import {IOpenApiRequestOptions} from "./request.interface";
import {IOpenApiResponseOptions, IOpenApiResponseType} from "./common.interface";

export interface IOpenApiRouteOptions extends IOpenApiRequestOptions, Omit<RequestMappingMetadata, 'method'> {

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
import {IOpenApiTagGroups, IOpenApiTags} from "./common.interface";
import {IOpenApiHeaderOptions} from "./header.interface";
import {IOpenApiQueryOptions} from "./query.interface";
import {IOpenApiParamOptions} from "./param.interface";

export interface IOpenApiRequestOptions {

  /**
   * OpenAPI exclude
   * @invokes @ApiExcludeController | @ApiExcludeEndpoint
   */
  exclude?: boolean;

  /**
   * OpenAPI Tags / Groups
   * @invokes @OATag | @OATagGroup
   */
  tags?: IOpenApiTags;
  tagGroups?: IOpenApiTagGroups;

  /**
   * OpenAPI Headers
   * @invokes @OAHeaders
   */
  headers?: IOpenApiHeaderOptions;

  /**
   * OpenAPI Query
   * @invokes @OAQueries
   */
  query?: IOpenApiQueryOptions;

  /**
   * OpenAPI Query
   * @invokes @OAParams
   */
  params?: IOpenApiParamOptions;

}

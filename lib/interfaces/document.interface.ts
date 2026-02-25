import {SwaggerDocumentOptions} from "@nestjs/swagger/dist/interfaces";
import {OpenAPIObject} from "@nestjs/swagger";
import {TagObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {IOpenApiStatus, IOpenApiTagGroupMetadata, IOpenApiTypeRefSingle} from "./common.interface";
import {Type} from "@nestjs/common";

export interface IOpenApiDocumentOptions extends SwaggerDocumentOptions {

  /**
   * Indicates whether the tags in a tag group should be unique.
   * If set to `true`, tags in a specific tag group will have the group name as a prefix and the original name will be set as 'x-displayName' to avoid duplicate tags in the generated OpenAPI document.
   * If set to `false` or undefined, the tags will be added to the groups without transforming the name
   *
   * @default true
   */
  uniqueTagGroupTags?: boolean;

  /**
   * A function that generates a unique name by combining a tag group name with a tag name.
   *
   * @param {string} groupName - The name of the tag group.
   * @param {string} tagName - The individual tag name within the group.
   * @returns {string} A unique string that combines the group and tag names.
   */
  uniqueTagGroupTagNameFactory?: (groupName: string, tagName: string) => string;

  /**
   * Represents either a string or an object containing tag group metadata.
   * If set to string or object, it will be used to define the default tag group for all endpoints that have no explicit tag group assigned.
   * If true, it will add all ungrouped tags to the group "Ungrouped"
   * If false or empty, endpoints that have no tag group will not be grouped.
   *
   * @default false
   */
  tagGroupUngrouped?: boolean|string|Omit<IOpenApiTagGroupMetadata, 'tags'>;

  /**
   * Represents optional response overrides that can be applied to refine or replace
   * the OpenAPI response behavior for specific API request status codes.
   *
   * This variable is a record where each key corresponds to an OpenAPI status code,
   * and its value can be one of the following types:
   *  - `IOpenApiTypeRefSingle`: A single OpenAPI type reference for the response.
   *  - `[IOpenApiTypeRefSingle, string]`: A tuple containing a type reference and a subkey, which the actual response object will be stored under.
   *  - `IOpenApiDocumentOverrideResponse`: An object that allows further customization
   *    of the OpenAPI response representation.
   *
   * These overrides assist in tailoring API documentation or runtime behaviors to match
   * custom requirements for different status codes.
   */
  responseOverrides?: IOpenApiDocumentOverrideResponses;

  /**
   * A factory function that generates a custom model name for a response override.
   *
   * This function is invoked to dynamically create a model name based on the provided
   * override name and response type. It allows customization of naming conventions
   * for response overrides programmatically.
   *
   * Only applicable when using the `responseOverrides` option, for overrides that have a `subKey` defined, and if the `responseType` does either have a type or schema with `type` defined.
   *
   * @param {string} overrideName - The name of the override rule to be applied.
   * @param {string} responseType - The type of the response for which the model name is being generated.
   * @returns {string} The custom model name generated based on the input parameters.
   *
   * @default true
   */
  responseOverrideModelNameFactory?: boolean | ((overrideName: string, responseType: string) => string);

}

export type IOpenApiDocumentOverrideResponses = Partial<Record<IOpenApiDocumentOverrideResponseStatus, IOpenApiDocumentOverrideResponseValue>>;

export type IOpenApiDocumentOverrideResponseStatus =
  | 'default' // every status
  | 'info' // 1XX
  | 'success' // 2XX
  | 'redirect' // 3XX
  | 'error' // 4XX, 5XX
  | 'clientError' // 4XX
  | 'serverError' // 5XX
  | IOpenApiStatus;

export type IOpenApiDocumentOverrideResponseValue = IOpenApiTypeRefSingle | [Type<unknown>, string] | IOpenApiDocumentOverrideResponse;

export interface IOpenApiDocumentOverrideResponse {
  type: Type<unknown>;
  subKey?: string;
}

export interface OpenApiDocument extends Omit<OpenAPIObject, 'tags'> {
  tags?: OpenApiDocumentTag[];
  'x-tagGroups'?: OpenApiDocumentTagGroup[];
}

export interface OpenApiDocumentTag extends TagObject {
  'x-displayName'?: string;
}

export interface OpenApiDocumentTagGroup {
  name: string;
  description?: string;
  tags?: string[];
}
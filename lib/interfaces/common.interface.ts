import {Type} from "@nestjs/common";
import {
  ApiResponseExamples,
  ApiResponseNoStatusOptions,
  ApiResponseOptions
} from "@nestjs/swagger/dist/decorators/api-response.decorator";

/**
 * Represents the status of an OpenAPI operation.
 * Can either be a numeric HTTP status code or a string representing a class of HTTP status codes.
 *
 * - A numeric value represents a specific HTTP status code (e.g., 200, 404).
 * - A string value represents a range of HTTP status codes, where:
 *   - '1XX' corresponds to informational responses.
 *   - '2XX' corresponds to successful responses.
 *   - '3XX' corresponds to redirection messages.
 *   - '4XX' corresponds to client error responses.
 *   - '5XX' corresponds to server error responses.
 */
export type IOpenApiStatus = number | '1XX' | '2XX' | '3XX' | '4XX' | '5XX';

/**
 * Represents a type definition for OpenAPI, which can be one of several predefined structures used for API schema configuration.
 *
 * This type is designed to accommodate various object representations, functions, or forward references utilized in OpenAPI specifications. Each of these options enables flexibility when working with complex API type definitions.
 *
 * Possible structures for IOpenApiType include:
 * - A Type of unknown.
 * - An array containing a Type of unknown.
 * - A Function type, or an array containing a Function type.
 * - An IOpenApiForwardRef type enabling forward reference resolution.
 * - A string type representation, often used for generic or primitive types.
 *
 * The components of this type allow for dynamic and versatile schema definitions, making it suitable for diverse OpenAPI use cases.
 */
export type IOpenApiType<T = unknown> = IOpenApiTypeRef<T> | Function | [Function] | string;
export type IOpenApiTypeRef<T = unknown> = IOpenApiTypeRefSingle<T> | IOpenApiTypeRefList<T>;
export type IOpenApiTypeRefSingle<T = unknown> = Type<T> | IOpenApiForwardRef<Type<T>>;
export type IOpenApiTypeRefList<T = unknown> = Type<T>[] | IOpenApiForwardRef<Type<T>[]>;

/**
 * A type definition for a forward reference in an OpenAPI context.
 *
 * This type allows for the resolution of a reference at a later time, useful for cases involving circular dependencies
 * or where the type reference cannot be immediately provided. It ensures deferred evaluation of the type.
 *
 * @template T The type that will be returned by the forward reference.
 *
 * @returns T The resolved type, which can either be a single type or an array of types.
 */
export type IOpenApiForwardRef<T = Type<unknown> | [Type<unknown>]> = () => T;

/**
 * Represents OpenAPI types for defining response information.
 * This type can either be an `IOpenApiResponseType` or an `IOpenApiResponseOptions` object.
 * It is used to define the response type and status code for an API endpoint.
 */
export type IOpenApiResponseType = IOpenApiTypeRef;
export type IOpenApiResponseOptions = ApiResponseNoStatusOptions & {
  status?: number;
  type?: IOpenApiForwardRef;
};

/**
 * Represents OpenAPI types for defining error response information.
 * This type can either be an `IOpenApiErrorType` or an `IOpenApiErrorOptions` object.
 * It is used to define the error response type and status code for an API endpoint.
 */
export type IOpenApiErrorType = IOpenApiTypeRef;
export type IOpenApiErrorOptions = Omit<ApiResponseOptions, 'type'> & {
  type?: IOpenApiErrorType;
  example?: any;
  examples?: Record<string, ApiResponseExamples>;
};

/**
 * Represents a route or a collection of routes that are used in OpenAPI specifications.
 *
 * This type can either be:
 * - A single route defined as a string.
 * - A collection of routes represented as an array of strings.
 *
 * It is typically used to specify paths or endpoints in systems following the OpenAPI standard.
 */
export type IOpenApiRouteLike = string | string[];

/**
 * Represents a type host in the OpenAPI definition.
 * This interface is designed to associate or define a specific type with an OpenAPI entity.
 * It serves as a container for the type information that can optionally be specified.
 */
export interface IOpenApiTypeHost {
  type?: IOpenApiType;
}

/**
 * Represents an OpenAPI specification construct for defining tags.
 * Tags are used to group API endpoints logically.
 * This type allows for a list of strings representing tag names or
 * objects with additional metadata associated with a tag.
 *
 * @typedef {Array<string | IOpenApiTagMetadata>} IOpenApiTags
 */
export type IOpenApiTags = Array<string|IOpenApiTagMetadata>;

/**
 * Represents metadata for an OpenAPI tag including its name, optional display name, description, and trait status.
 *
 * This interface is used to define additional descriptive information about a tag
 * used in OpenAPI documentation. Tags are typically used to group operations or
 * endpoints under a logical category for better organization and clarity.
 *
 * The properties of this interface provide options to customize how the tag is
 * displayed and described in the OpenAPI definition.
 *
 * Properties:
 * - `name`: The internal name of the tag. This property is required and usually correlates to the operational grouping in the specification.
 * - `displayName`: An optional, user-readable name to display for the tag. If not provided, the value of `name` may be used instead.
 * - `description`: An optional description providing additional context or details about the tag's purpose or contents.
 * - `trait`: An optional flag which when true, it appears without any content (subitems, operations) in the middle panel.
 *            However, you can add content to its description field, which is rendered in the middle panel.
 *            This is useful for handling common information like pagination and rate limits, as you can provide a detailed description for the tag using external Markdown files.
 */
export interface IOpenApiTagMetadata {
  name: string;
  displayName?: string;
  description?: string
  trait?: boolean;
}

/**
 * Represents an array of tag groups for an OpenAPI specification.
 *
 * Each element in the array can either be a string, representing a tag name,
 * or an object implementing the IOpenApiGroupTagMetadata interface, which provides
 * additional metadata or organization for the tag group.
 */
export type IOpenApiTagGroups = Array<string|IOpenApiTagGroupMetadata>;

/**
 * Represents metadata for grouping and tagging in an OpenAPI specification.
 * This interface is used to define properties associated with a specific
 * API group or tag.
 */
export interface IOpenApiTagGroupMetadata {
  name: string;
  description?: string;
  tags?: string[];
}
import { MetadataAccessor, MetadataListAccessor, MetadataMapAccessor } from './utils/metadata.utils';
import type { IOpenApiTagGroupMetadata, IOpenApiTagMetadata } from './interfaces/common.interface';
import type { IOpenApiExtensionMetadata } from './interfaces/extension.interface';
import type { ApiPropertyOptions, ApiResponseOptions } from '@nestjs/swagger';
import { DECORATORS as SWAGGER_DECORATORS } from '@nestjs/swagger';
import type { Type } from '@nestjs/common';
import { IOpenApiOriginMetadata } from './interfaces/origin.interface';
import { DecoratorKind } from './utils/decorator.utils';

/**
 * An object that defines supported OpenAPI versions and their respective configurations.
 */
export const OPENAPI_VERSIONS = {
  '3.0.0': {
    allowedOperations: ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'],
  },
  '3.1.0': {
    allowedOperations: ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'],
  },
  '3.2.0': {
    allowedOperations: ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace', 'query'],
  },
}

/**
 * A collection of stores used for managing application data.
 *
 * @property {Map<number, IOpenApiOriginMetadata>} ORIGINS
 * A map where the keys represent numeric identifiers, and the values store metadata
 * associated with OpenAPI origins.
 */
export const STORES = {
  ORIGINS: new Map<number, IOpenApiOriginMetadata>(),
}

/**
 * A collection of pre-defined metadata accessor utilities and groups for handling
 * OpenAPI and Swagger-related decorators in the application. These utilities are
 * designed to manage metadata for OpenAPI/Swagger schema specifications.
 */
export const DECORATORS = {
  OPENAPI: {
    TAGS: MetadataListAccessor<IOpenApiTagMetadata>('openapi/tags', 'name'),
    TAG_GROUPS: MetadataAccessor<IOpenApiTagGroupMetadata>('openapi/tagGroups'),
    EXTENSIONS: MetadataMapAccessor<Record<string, IOpenApiExtensionMetadata>>('openapi/extensions'),
  },
  SWAGGER: {
    TAGS: MetadataListAccessor<string>(SWAGGER_DECORATORS.API_TAGS),
    RESPONSES: MetadataMapAccessor<{ [key: string|number]: ApiResponseOptions }>(SWAGGER_DECORATORS.API_RESPONSE),
    EXTRA_MODELS: MetadataListAccessor<Type>(SWAGGER_DECORATORS.API_EXTRA_MODELS),
    MODEL_PROPERTIES: MetadataAccessor<ApiPropertyOptions>(SWAGGER_DECORATORS.API_MODEL_PROPERTIES),
    MODEL_PROPERTIES_ARRAY: MetadataListAccessor<`:${string}`>(SWAGGER_DECORATORS.API_MODEL_PROPERTIES_ARRAY),
  }
};

/**
 * An object representing various custom OpenAPI extensions.
 */
export const EXTENSIONS = {
  ORIGIN: 'x-oa-origin',
  ORIGIN_KIND: (kind?: DecoratorKind) => [EXTENSIONS.ORIGIN, 'kind', kind].filter(Boolean).join(':'),
  ADDITIONAL_OPERATIONS: 'x-oai-additionalOperations',
};
import {MetadataAccessor, MetadataListAccessor, MetadataMapAccessor} from "../utils/metadata.utils";
import {IOpenApiTagGroupMetadata, IOpenApiTagMetadata} from "../interfaces/common.interface";
import {DECORATORS as SWAGGER_DECORATORS} from "@nestjs/swagger/dist/constants";
import {Type} from "@nestjs/common";
import {ApiResponseOptions} from "@nestjs/swagger/dist/decorators/api-response.decorator";
import {ApiPropertyOptions} from "@nestjs/swagger";

export const DECORATORS = {

  // package specific decorators
  OPENAPI: {
    TAGS: MetadataListAccessor<IOpenApiTagMetadata>('openapi/tags', 'name'),
    TAG_GROUPS: MetadataAccessor<IOpenApiTagGroupMetadata>('openapi/tagGroups'),
  },

  // helpers for swagger decorators
  SWAGGER: {
    TAGS: MetadataListAccessor<string>(SWAGGER_DECORATORS.API_TAGS),
    RESPONSES: MetadataMapAccessor<{ [key: string|number]: ApiResponseOptions }>(SWAGGER_DECORATORS.API_RESPONSE),
    EXTRA_MODELS: MetadataListAccessor<Type<unknown>>(SWAGGER_DECORATORS.API_EXTRA_MODELS),
    MODEL_PROPERTIES: MetadataAccessor<ApiPropertyOptions>(SWAGGER_DECORATORS.API_MODEL_PROPERTIES),
    MODEL_PROPERTIES_ARRAY: MetadataListAccessor<`:${string}`>(SWAGGER_DECORATORS.API_MODEL_PROPERTIES_ARRAY),
  }

};
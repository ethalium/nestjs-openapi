import type { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import type { IOpenApiType } from './common.interface';
import type { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';

export type IOpenApiQueryOptions = IOpenApiQuerySpec;

export interface IOpenApiQuerySpec {
  [query: string]: Omit<IOpenApiQueryMetadata, 'name'>;
}

export interface IOpenApiQueryMetadata extends Omit<ParameterObject, 'in'> {
  type?: IOpenApiType;
  format?: string;
  enum?: SwaggerEnumType;
  enumName?: string;
  isArray?: boolean;
}
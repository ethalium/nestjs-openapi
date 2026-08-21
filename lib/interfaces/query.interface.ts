import { IOpenApiAllowedEnumTypes, IOpenApiType } from './common.interface';
import type { ParameterObject } from '@nestjs/swagger';

export type IOpenApiQueryOptions = IOpenApiQuerySpec;

export interface IOpenApiQuerySpec {
  [query: string]: Omit<IOpenApiQueryMetadata, 'name'>;
}

export interface IOpenApiQueryMetadata extends Omit<ParameterObject, 'in'> {
  type?: IOpenApiType;
  format?: string;
  enum?: IOpenApiAllowedEnumTypes;
  enumName?: string;
  isArray?: boolean;
}
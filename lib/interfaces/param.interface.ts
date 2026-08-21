import { IOpenApiAllowedEnumTypes, IOpenApiType } from './common.interface';
import { ParameterObject } from '@nestjs/swagger';

export type IOpenApiParamOptions = IOpenApiParamSpec;

export interface IOpenApiParamSpec {
  [param: string]: Omit<IOpenApiParamMetadata, 'name'>;
}

export interface IOpenApiParamMetadata extends Omit<ParameterObject, 'in'>{
  type?: IOpenApiType;
  format?: string;
  enum?: IOpenApiAllowedEnumTypes;
  enumName?: string;
}
import {IOpenApiType} from "./common.interface";
import {SwaggerEnumType} from "@nestjs/swagger/dist/types/swagger-enum.type";
import {ParameterObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export type IOpenApiParamOptions = IOpenApiParamSpec;

export interface IOpenApiParamSpec {
  [param: string]: Omit<IOpenApiParamMetadata, 'name'>;
}

export interface IOpenApiParamMetadata extends Omit<ParameterObject, 'in'>{
  type?: IOpenApiType;
  format?: string;
  enum?: SwaggerEnumType;
  enumName?: string;
}
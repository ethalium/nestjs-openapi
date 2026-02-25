import {ParameterObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {IOpenApiType} from "./common.interface";
import {SwaggerEnumType} from "@nestjs/swagger/dist/types/swagger-enum.type";

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
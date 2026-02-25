import {IOpenApiType, IOpenApiTypeHost} from "./common.interface";
import {ApiResponseMetadata} from "@nestjs/swagger/dist/decorators/api-response.decorator";

export type IOpenApiBodyOptions = IOpenApiType | IOpenApiBodyMetadata;

export interface IOpenApiBodyMetadata extends IOpenApiTypeHost, Omit<ApiResponseMetadata, 'type'> {}
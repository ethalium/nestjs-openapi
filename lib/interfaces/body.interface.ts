import type { IOpenApiType, IOpenApiTypeHost } from './common.interface';
import type { ApiResponseMetadata } from '@nestjs/swagger';

export type IOpenApiBodyOptions = IOpenApiType | IOpenApiBodyMetadata;

export interface IOpenApiBodyMetadata extends IOpenApiTypeHost, Omit<ApiResponseMetadata, 'type'> {}
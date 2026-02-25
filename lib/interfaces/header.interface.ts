import {ApiHeaderOptions} from "@nestjs/swagger";

export type IOpenApiHeaderOptions = IOpenApiHeaderSpec;

export interface IOpenApiHeaderSpec {
  [header: string]: Omit<ApiHeaderOptions, 'name'>;
}

export interface IOpenApiHeaderMetadata extends Omit<ApiHeaderOptions, 'name'> {}
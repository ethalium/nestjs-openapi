import { IOpenApiDocumentTransformer } from './document.transformer';
import { IOpenApiOperationTransformer } from './operation.transformer';
import { IOpenApiOperationExtensionTransformer } from './operation-extension.transformer';

export interface IOpenApiTransformerBase {
  readonly order?: number;
}

export type IOpenApiTransformer = IOpenApiDocumentTransformer|IOpenApiOperationTransformer|IOpenApiOperationExtensionTransformer;
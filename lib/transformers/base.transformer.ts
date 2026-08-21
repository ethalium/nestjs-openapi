import { IOpenApiDocumentTransformer } from './document.transformer';
import { IOpenApiOperationTransformer } from './operation.transformer';
import { IOpenApiOperationExtensionTransformer } from './operation-extension.transformer';

export interface IOpenApiTransformerBase {
  readonly order?: number;
}

export type IOpenApiTransformer<T extends IOpenApiTransformerType = IOpenApiTransformerType> = T | IOpenApiTransformer<T>[];
export type IOpenApiTransformerType = IOpenApiDocumentTransformer|IOpenApiOperationTransformer|IOpenApiOperationExtensionTransformer;

export function combineTransformers<T extends IOpenApiTransformerType>(...transformers: IOpenApiTransformer<T>[]): T[] {
  // @ts-ignore
  return transformers.flat(Infinity);
}
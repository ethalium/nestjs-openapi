import { combineTransformers, IOpenApiTransformer, IOpenApiTransformerBase } from './base.transformer';
import { IOpenApiOperationTransformContext } from './operation.transformer';
import { IOpenApiExtensionKey } from '../interfaces/extension.interface';

export interface IOpenApiOperationExtensionTransformer<TProperties = unknown, TPropertiesTransformed = TProperties> extends IOpenApiTransformerBase {

  /**
   * Marks this transformer as a operation extension transformer
   */
  readonly kind: 'operation-extension';

  /**
   * Specifies the extension key to be transformed.
   */
  readonly extension: IOpenApiExtensionKey;

  /**
   * Indicates if the extension should be added to document. If false, the extension key will not be added to the document.
   * @default true
   */
  readonly consumeExtension?: boolean;

  /**
   * Transforms the provided context based on the implementation specifics and returns the transformed properties.
   *
   * @param context {IOpenApiOperationExtensionTransformContext<TProperties>} - An object implementing the IOpenApiExtensionTransformContext interface, providing the necessary information for transformation.
   * @return {TPropertiesTransformed|void} - Can return the transformed properties or undefined to use the current properties.
   */
  transform?(context: IOpenApiOperationExtensionTransformContext<TProperties>): TPropertiesTransformed | void;

}

export interface IOpenApiOperationExtensionTransformContext<TProperties = unknown> extends IOpenApiOperationTransformContext {
  readonly propertiesFromController: TProperties|undefined;
  readonly propertiesFromMethod: TProperties|undefined;
  readonly properties: TProperties|undefined;
}

export function createOperationExtensionTransformer<TProperties = unknown, TPropertiesTransformed = TProperties>(options: Omit<IOpenApiOperationExtensionTransformer<TProperties, TPropertiesTransformed>, 'kind'>): IOpenApiOperationExtensionTransformer<TProperties, TPropertiesTransformed> {
  return {
    ...options,
    kind: 'operation-extension',
  };
}

export function combineOperationExtensionTransformers(...transformers: IOpenApiTransformer<IOpenApiOperationExtensionTransformer>[]): IOpenApiOperationExtensionTransformer[] {
  return combineTransformers<IOpenApiOperationExtensionTransformer>(transformers);
}
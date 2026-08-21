import { combineTransformers, IOpenApiTransformer, IOpenApiTransformerBase } from './base.transformer';
import type { OperationObject, PathItemObject } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export interface IOpenApiOperationTransformer extends IOpenApiTransformerBase {

  /**
   * Marks this transformer as a operation transformer
   */
  readonly kind: 'operation';

  /**
   * Transforms the given OpenAPI operation context into an OperationObject.
   *
   * @param context {IOpenApiOperationTransformContext} - The context of the OpenAPI operation to be transformed. It contains all relevant data and metadata required for the transformation process.
   * @return {OperationObject|void} - Can return the transformed operation or undefined to update the operation in-place.
   */
  transform?(context: IOpenApiOperationTransformContext): OperationObject | void;

}

export interface IOpenApiOperationTransformContext {
  readonly document: OpenAPIObject;
  readonly path: string;
  readonly method: string;
  readonly pathObject: PathItemObject;
  readonly operationObject: OperationObject;

  readonly originClass: Type|null;
  readonly originPropertyDescriptor: PropertyDescriptor|null;
}

export function createOperationTransformer(options: Omit<IOpenApiOperationTransformer, 'kind'>): IOpenApiOperationTransformer {
  return {
    ...options,
    kind: 'operation',
  };
}

export function combineOperationTransformers(...transformers: IOpenApiTransformer<IOpenApiOperationTransformer>[]): IOpenApiOperationTransformer[] {
  return combineTransformers<IOpenApiOperationTransformer>(transformers);
}
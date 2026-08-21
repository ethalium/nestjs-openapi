import { combineTransformers, IOpenApiTransformer, IOpenApiTransformerBase } from './base.transformer';
import { OpenAPIObject } from '@nestjs/swagger';

export interface IOpenApiDocumentTransformer extends IOpenApiTransformerBase {

  /**
   * Marks this transformer as a document transformer
   */
  readonly kind: 'document';

  /**
   * Transforms the provided OpenApiDocument according to specific modifications or operations.
   *
   * @param {OpenAPIObject} document - The OpenAPIObject object to be transformed.
   * @return {OpenAPIObject|void} - Can return the OpenAPIObject or undefined to update the document in-place.
   */
  transform?(document: OpenAPIObject): OpenAPIObject | void;

}

export function createDocumentTransformer(options: Omit<IOpenApiDocumentTransformer, 'kind'>): IOpenApiDocumentTransformer {
  return {
    ...options,
    kind: 'document',
  };
}

export function combineDocumentTransformers(...transformers: IOpenApiTransformer<IOpenApiDocumentTransformer>[]): IOpenApiDocumentTransformer[] {
  return combineTransformers<IOpenApiDocumentTransformer>(transformers);
}
import { OpenAPIObject } from '@nestjs/swagger';
import { combineTransformers, IOpenApiTransformer, IOpenApiTransformerType } from './transformers/base.transformer';
import { IOpenApiOperationTransformContext } from './transformers/operation.transformer';
import { IOpenApiOperationExtensionTransformContext } from './transformers/operation-extension.transformer';
import { DECORATORS, EXTENSIONS, STORES } from './openapi.constants';
import { MoveQueryMethodToExtensionBefore32 } from './transformers/builtin/move-query-method-to-extension-before-32';
import { EnsureDescription } from './transformers/builtin/ensure-description';
import { isOpenApiOperationBuiltIn } from './utils/version.utils';

export class OpenApiTransformer {
  private readonly customTransformers!: IOpenApiTransformerType[];
  private readonly staticTransformers: IOpenApiTransformerType[] = [
    EnsureDescription,
    MoveQueryMethodToExtensionBefore32,
  ];

  constructor(transformers: IOpenApiTransformer){
    this.customTransformers = combineTransformers(transformers).sort(
      (a, b) => (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY)
    );
  }

  /**
   * Retrieves an array of OpenAPI transformers by merging static and custom transformers.
   *
   * @return {IOpenApiTransformerType[]} A flattened array containing both static and custom OpenAPI transformers.
   */
  private get transformers(): IOpenApiTransformerType[] {
    return [this.staticTransformers, this.customTransformers].flat();
  }

  /**
   * Transforms the given OpenAPI document by applying a series of transformations to the document, operations,
   * and operation extensions, as defined by the registered transformers.
   *
   * @param {OpenAPIObject} document - The OpenAPI document to be transformed.
   * @return {OpenAPIObject} - The transformed OpenAPI document.
   */
  transform(document: OpenAPIObject): OpenAPIObject {

    // transform document
    const documentTransformers = this.transformers.filter(_ => _.kind === 'document');
    for(const transformer of documentTransformers){
      const transformed = transformer.transform?.(document);
      if(transformed){
        document = transformed;
      }
    }

    // transform operations
    const operationTransformers = this.transformers.filter(_ => _.kind === 'operation');
    for(const context of this.getOperationContexts(document)) {
      for(const transformer of operationTransformers) {
        const transformed = transformer.transform?.(context);
        if(transformed){
          context.pathObject[context.method] = transformed;
        }
      }
    }

    // transform operation extensions
    const operationExtensionTransformers = this.transformers.filter(_ => _.kind === 'operation-extension');
    for(const context of this.getOperationContexts(document)) {
      const activeTransformers = operationExtensionTransformers.filter(_ => _.extension in context.operationObject);
      for(const transformer of activeTransformers) {
        const extensionContext: IOpenApiOperationExtensionTransformContext = {
          ...context,
          propertiesFromController: context.originClass ? DECORATORS.OPENAPI.EXTENSIONS.get(transformer.extension, context.originClass)?.properties : undefined,
          propertiesFromMethod: context.originPropertyDescriptor ? DECORATORS.OPENAPI.EXTENSIONS.get(transformer.extension, context.originPropertyDescriptor.value)?.properties : undefined,
          properties: context.operationObject[transformer.extension],
        };
        const transformed = transformer.transform?.(extensionContext);
        if(transformed){
          context.operationObject[transformer.extension] = transformed;
        }
      }
      for(const extension of activeTransformers.filter(_ => _.consumeExtension === false).map(_ => _.extension)) {
        if(extension in context.operationObject) {
          delete context.operationObject[extension];
        }
      }
    }

    // return document
    return this.finalizeDocument(document);

  }

  /**
   * Extracts and collects operation contexts from the given OpenAPI document.
   *
   * @param {OpenAPIObject} document - The OpenAPI document containing API definitions.
   * @return {IOpenApiOperationTransformContext[]} An array of operation transform contexts,
   * each representing metadata and associations for API operations defined in the document.
   */
  private getOperationContexts(document: OpenAPIObject): IOpenApiOperationTransformContext[] {
    const operations: IOpenApiOperationTransformContext[] = [];
    for(const [path, pathObject] of Object.entries(document.paths)) {
      for(const [operation, operationObject] of Object.entries(pathObject)){
        if(isOpenApiOperationBuiltIn(operation) && operationObject && typeof operationObject === 'object' && !Array.isArray(operationObject)){
          const originClassExtensionName = EXTENSIONS.ORIGIN_KIND('class');
          const originPropertyDescriptorExtensionName = EXTENSIONS.ORIGIN_KIND('method');
          const originClass = (originClassExtensionName in operationObject) ? STORES.ORIGINS.get(operationObject[originClassExtensionName])?.classType || null : null;
          const originPropertyDescriptor = (originPropertyDescriptorExtensionName in operationObject) ? STORES.ORIGINS.get(operationObject[originPropertyDescriptorExtensionName])?.propertyDescriptor || null : null;
          operations.push({
            document: document,
            path: path,
            method: operation,
            pathObject: pathObject,
            operationObject: operationObject,
            originClass: originClass,
            originPropertyDescriptor: originPropertyDescriptor
          });
        }
      }
    }
    return operations;
  }

  /**
   * Finalizes the given OpenAPI document by applying necessary transformations.
   * This method modifies the document by removing specific origin kinds.
   *
   * @param {OpenAPIObject} document - The OpenAPI document to be finalized.
   * @return {OpenAPIObject} The finalized OpenAPI document after modifications.
   */
  private finalizeDocument(document: OpenAPIObject): OpenAPIObject {
    document = this.removeOriginKinds(document);
    return document;
  }

  /**
   * Removes properties from the provided object whose keys are considered "origin kinds".
   * An "origin kind" is defined based on matching the `EXTENSIONS.ORIGIN_KIND()` value.
   * The removal process is recursive and applies to nested objects and arrays.
   *
   * @param {T} obj The object from which origin kinds should be removed.
   * @return {T} The modified object with all origin kinds removed.
   */
  private removeOriginKinds<T extends object>(obj: T): T {
    for(const [key, value] of Object.entries(obj)){

      // remove key if it is an origin kind
      if(key.startsWith(EXTENSIONS.ORIGIN_KIND())){
        delete obj[key];
        continue;
      }

      // skip execution if value is falsy
      if(!value){
        continue;
      }

      // remove origin kinds from object
      if(typeof value === 'object' && !Array.isArray(value)){
        obj[key] = this.removeOriginKinds(value);
      }

      // remove origin kinds from array
      if(Array.isArray(value)){
        obj[key] = value.map((item) => {
          if(item && typeof item === 'object'){
            return this.removeOriginKinds(item);
          }
          return item;
        });
      }

    }
    return obj;
  }

}
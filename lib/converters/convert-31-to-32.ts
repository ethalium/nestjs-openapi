import { OpenAPIObject } from '@nestjs/swagger';
import { isPlainObject } from '../utils/type.utils';
import { isOpenApiOperationBuiltIn, isOpenApiVersion } from '../utils/version.utils';
import { EXTENSIONS, OPENAPI_VERSIONS } from '../openapi.constants';

const OPENAPI_VERSION = '3.2.0';
const OPENAPI_VERSION_CONFIG = OPENAPI_VERSIONS[OPENAPI_VERSION];

export function convertOpenApi31To32(document: OpenAPIObject): OpenAPIObject {

  // return document without converting it if version equals the target
  if(isOpenApiVersion(OPENAPI_VERSION, document)){
    return document;
  }

  // throw error if version is not 3.1.X
  if(!isOpenApiVersion('3.1.0', document)){
    throw new Error(`Unsupported OpenAPI version provided. Expected: ^3.1.0; Got: ${document.openapi}`);
  }

  // clone document
  document = JSON.parse(JSON.stringify(document));

  // upgrade document
  upgradeDocument(document);

  // set new version
  document.openapi = OPENAPI_VERSION;

  // return document
  return document;

}

function upgradeDocument(document: Record<string, any>): void {
  processPathItemMap(document.paths);
  processPathItemMap(document.webhooks);
  if(isPlainObject(document.components)){
    processPathItemMap(document.components.pathItems);
    processCallbackMap(document.components.callbacks);
  }
}

function processPathItemMap(pathItems: Record<string, any>): void {
  if(isPlainObject(pathItems)){
    Object.values(pathItems).forEach(processPathItem);
  }
}

function processPathItem(pathItem: object): void {
  if(isPlainObject(pathItem)){
    promoteAdditionalOperations(pathItem);
    Object.entries(pathItem).forEach(([operation, operationObject]) => {
      if(isPlainObject(operationObject) && isOpenApiOperationBuiltIn(operation, OPENAPI_VERSION)) {
        processOperation(operationObject);
      }
    });
  }
}

function promoteAdditionalOperations(pathItem: any): void {

  // extract additional operations from path item and extension
  const extensionOperations = isPlainObject(pathItem[EXTENSIONS.ADDITIONAL_OPERATIONS]) ? pathItem[EXTENSIONS.ADDITIONAL_OPERATIONS] : {};
  const additionalOperations = isPlainObject(pathItem.additionalOperations) ? pathItem.additionalOperations : {};

  // promote additional operations from extension to pathItem
  Object.entries(extensionOperations).forEach(([method, operation]) => {
    if(OPENAPI_VERSION_CONFIG.allowedOperations.includes(method.trim().toLowerCase())) {
      if (method.trim().toLowerCase() in pathItem) {
        throw new Error(`Cannot convert ${EXTENSIONS.ADDITIONAL_OPERATIONS}.${method}: the Path Item already defines this method.`);
      }
      pathItem[method.trim().toLowerCase()] = operation;
      return;
    }
    if (method in additionalOperations) {
      throw new Error(`Cannot convert ${EXTENSIONS.ADDITIONAL_OPERATIONS}.${method}: additionalOperations already defines this method.`);
    }
    additionalOperations[method] = operation;
  });

  // apply additional operations to path item
  if (Object.keys(additionalOperations).length > 0) {
    pathItem.additionalOperations = additionalOperations;
  }

  // remove additional operations extension from path item
  delete pathItem[EXTENSIONS.ADDITIONAL_OPERATIONS];

}

function processOperation(operation: any): void {
  if (isPlainObject(operation)) {
    processCallbackMap(operation.callbacks);
  }
}

function processCallbackMap(callbacks: any): void {
  if (!isPlainObject(callbacks)) {
    return;
  }
  for (const callback of Object.values(callbacks)) {
    if (isPlainObject(callback) && !('$ref' in callback)) {
      processPathItemMap(callback);
    }
  }
}
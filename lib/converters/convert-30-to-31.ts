import { OpenAPIObject } from '@nestjs/swagger';
import { isPlainObject } from '../utils/type.utils';
import { isOpenApiVersion } from '../utils/version.utils';
import { EXTENSIONS, OPENAPI_VERSIONS } from '../openapi.constants';

const OPENAPI_VERSION = '3.1.0';
const OPENAPI_VERSION_CONFIG = OPENAPI_VERSIONS[OPENAPI_VERSION];

export function convertOpenApi30To31(document: OpenAPIObject): OpenAPIObject {

  // return document without converting it if version equals the target
  if(isOpenApiVersion(OPENAPI_VERSION, document)){
    return document;
  }

  // throw error if version is not 3.0
  if(!isOpenApiVersion('3.0.0', document)){
    throw new Error(`Unsupported OpenAPI version provided. Expected: ^3.0.0; Got: ${document.openapi}`);
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
  processComponents(document.components);
  processPathItemMap(document.paths);
  processPathItemMap(document.webhooks);
}

function processComponents(components: any): void {
  if(isPlainObject(components)){
    processSchemaMap(components.schemas);
    processParameterMap(components.parameters);
    processHeaderMap(components.headers);
    processRequestBodyMap(components.requestBodies);
    processResponseMap(components.responses);
    processCallbackMap(components.callbacks);
    processPathItemMap(components.pathItems);
    processMediaTypeMap(components.mediaTypes);
  }
}

function processPathItemMap(pathItems: any): void {
  if (!isPlainObject(pathItems)) {
    return;
  }
  Object.values(pathItems).forEach(processPathItem);
}

function processPathItem(pathItem: any): void {
  if (!isPlainObject(pathItem)) {
    return;
  }

  processParameters(pathItem.parameters);

  Object.entries(pathItem[EXTENSIONS.ADDITIONAL_OPERATIONS] || {}).forEach(([method, operation]) => {
    if(OPENAPI_VERSION_CONFIG.allowedMethods.includes(method.trim().toLowerCase())){
      pathItem[method] = operation;
      delete pathItem[EXTENSIONS.ADDITIONAL_OPERATIONS][method];
    }
  });

  Object.values(pathItem).forEach((operation) => {
    if(isPlainObject(operation)) {
      processOperation(operation);
    }
  });

  if (isPlainObject(pathItem[EXTENSIONS.ADDITIONAL_OPERATIONS])) {
    Object.values(pathItem[EXTENSIONS.ADDITIONAL_OPERATIONS]).forEach(processOperation);
  }
}

function processOperation(operation: any): void {
  if (!isPlainObject(operation)) {
    return;
  }

  processParameters(operation.parameters);
  processRequestBody(operation.requestBody);
  processResponses(operation.responses);
  processCallbackMap(operation.callbacks);
}

function processParameters(parameters: any): void {
  if (Array.isArray(parameters)) {
    parameters.forEach(processParameter);
  }
}

function processParameterMap(parameters: any): void {
  if (isPlainObject(parameters)) {
    Object.values(parameters).forEach(processParameter);
  }
}

function processParameter(parameter: any): void {
  if (!isPlainObject(parameter) || '$ref' in parameter) {
    return;
  }
  processSchema(parameter.schema);
  processMediaTypeMap(parameter.content);
}

function processHeaderMap(headers: any): void {
  if (isPlainObject(headers)) {
    Object.values(headers).forEach(processHeader);
  }
}

function processHeader(header: any): void {
  if (!isPlainObject(header) || '$ref' in header) {
    return;
  }
  processSchema(header.schema);
  processMediaTypeMap(header.content);
}

function processRequestBodyMap(requestBodies: any): void {
  if (isPlainObject(requestBodies)) {
    Object.values(requestBodies).forEach(processRequestBody);
  }
}

function processRequestBody(requestBody: any): void {
  if (!isPlainObject(requestBody) || '$ref' in requestBody) {
    return;
  }
  processMediaTypeMap(requestBody.content);
}

function processResponses(responses: any): void {
  if (isPlainObject(responses)) {
    Object.values(responses).forEach(processResponse);
  }
}

function processResponseMap(responses: any): void {
  if (isPlainObject(responses)) {
    Object.values(responses).forEach(processResponse);
  }
}

function processResponse(response: any): void {
  if (!isPlainObject(response) || '$ref' in response) {
    return;
  }
  processHeaderMap(response.headers);
  processMediaTypeMap(response.content);
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

function processMediaTypeMap(mediaTypes: any): void {
  if (!isPlainObject(mediaTypes)) {
    return;
  }
  Object.values(mediaTypes).forEach(processMediaType);
}

function processMediaType(mediaType: any): void {
  if (!isPlainObject(mediaType)) {
    return;
  }
  processSchema(mediaType.schema);
  processSchema(mediaType.itemSchema);
  if (isPlainObject(mediaType.encoding)) {
    Object.values(mediaType.encoding).forEach(processEncoding);
  }
}

function processEncoding(encoding: any): void {
  if (!isPlainObject(encoding)) {
    return;
  }
  processHeaderMap(encoding.headers);
  processEncoding(encoding.itemEncoding);
}

function processSchemaMap(schemas: any): void {
  if (isPlainObject(schemas)) {
    Object.values(schemas).forEach(processSchema);
  }
}

function processSchema(schema: any): void {
  if (!isPlainObject(schema)) {
    return;
  }

  upgradeExclusiveLimit(schema, 'minimum');
  upgradeExclusiveLimit(schema, 'maximum');
  upgradeNullable(schema);

  for (const key of SCHEMA_MAP_KEYS) {
    processSchemaMap(schema[key]);
  }

  for (const key of SCHEMA_SINGLE_KEYS) {
    processSchema(schema[key]);
  }

  for (const key of SCHEMA_LIST_KEYS) {
    if (Array.isArray(schema[key])) {
      schema[key].forEach(processSchema);
    }
  }

  if (isPlainObject(schema.dependencies)) {
    for (const dependency of Object.values(schema.dependencies)) {
      if (!Array.isArray(dependency)) {
        processSchema(dependency);
      }
    }
  }
}

function upgradeExclusiveLimit(schema: any, limit: 'minimum' | 'maximum'): void {
  const exclusiveKey = limit === 'minimum' ? 'exclusiveMinimum' : 'exclusiveMaximum';
  const exclusive: unknown = schema[exclusiveKey];

  if (typeof exclusive !== 'boolean') {
    return;
  }

  if (exclusive === false) {
    delete schema[exclusiveKey];
    return;
  }

  if (typeof schema[limit] !== 'number') {
    throw new Error(
      `Cannot convert ${exclusiveKey}: OpenAPI 3.0 requires a numeric ${limit} when ${exclusiveKey} is true.`,
    );
  }

  schema[exclusiveKey] = schema[limit];
  delete schema[limit];
}

function upgradeNullable(schema: any): void {
  if (typeof schema.nullable !== 'boolean') {
    return;
  }

  const nullable = schema.nullable;
  delete schema.nullable;

  if (!nullable) {
    return;
  }

  if (hasComposedAssertions(schema)) {
    wrapNullableAssertions(schema);
    return;
  }

  if (typeof schema.type === 'string') {
    schema.type = [schema.type, 'null'];
    return;
  }

  if (Array.isArray(schema.type)) {
    if (!schema.type.includes('null')) {
      schema.type.push('null');
    }
    return;
  }

  if (!hasSchemaAssertions(schema)) {
    // An unconstrained JSON Schema already accepts null.
    return;
  }

  wrapNullableAssertions(schema);
}

function hasComposedAssertions(schema: any): boolean {
  return (
    '$ref' in schema ||
    'allOf' in schema ||
    'anyOf' in schema ||
    'oneOf' in schema ||
    'not' in schema ||
    'if' in schema
  );
}

function wrapNullableAssertions(schema: any): void {
  const annotations: any = {};
  const assertions: any = {};
  Object.entries(schema).forEach(([key, value]) => {
    if (SCHEMA_ANNOTATION_KEYS.has(key) || key.startsWith('x-')) {
      annotations[key] = value;
    } else {
      assertions[key] = value;
    }
    delete schema[key];
  });
  Object.assign(schema, annotations, {
    anyOf: [assertions, { type: 'null' }],
  });
}

function hasSchemaAssertions(schema: any): boolean {
  return Object.keys(schema).some(
    (key) => !SCHEMA_ANNOTATION_KEYS.has(key) && !key.startsWith('x-'),
  );
}

const SCHEMA_MAP_KEYS = [
  'properties',
  'patternProperties',
  'dependentSchemas',
  '$defs',
  'definitions',
] as const;

const SCHEMA_SINGLE_KEYS = [
  'additionalProperties',
  'unevaluatedProperties',
  'propertyNames',
  'items',
  'contains',
  'unevaluatedItems',
  'contentSchema',
  'not',
  'if',
  'then',
  'else',
] as const;

const SCHEMA_LIST_KEYS = ['prefixItems', 'allOf', 'anyOf', 'oneOf'] as const;

const SCHEMA_ANNOTATION_KEYS = new Set([
  '$comment',
  'title',
  'description',
  'default',
  'deprecated',
  'readOnly',
  'writeOnly',
  'example',
  'examples',
  'externalDocs',
  'xml',
  'discriminator',
]);
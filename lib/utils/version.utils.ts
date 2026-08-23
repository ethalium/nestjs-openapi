import type { OpenAPIObject } from '@nestjs/swagger';
import { OPENAPI_VERSIONS } from '../openapi.constants';

/** @internal */
export function parseOpenApiVersion(versionOrDocument: string|Pick<OpenAPIObject, 'openapi'>): { major: number, minor: number, patch: number, family: string } {

  // extract openapi version from parameter
  const openapi = (typeof versionOrDocument === 'string' ? versionOrDocument : versionOrDocument?.openapi) || 'n/A';

  // extract openapi version from document.openapi
  const versionMatch = openapi?.match(/^(\d+)\.(\d+)(?:\.(\d+))?$/);
  const version = versionMatch
    ? {
      major: Number(versionMatch[1]),
      minor: Number(versionMatch[2]),
      patch: versionMatch[3] !== undefined ? Number(versionMatch[3]) : 0,
    }
    : undefined;

  // throw error if version is not found
  if (!version) {
    throw new Error(`Unable to parse OpenAPI version from '${openapi}'`);
  }

  // return version
  return {
    ...version,
    family: `${version.major}.${version.minor}.0`,
  };

}

/** @internal */
export function isOpenApiVersion(expectedVersion: string, document: OpenAPIObject): boolean {
  const version = parseOpenApiVersion(document);
  const expected = parseOpenApiVersion({ openapi: expectedVersion });
  return version.major === expected.major && version.minor === expected.minor;
}

/** @internal */
export function isOpenApiOperationBuiltIn(operation: string, version?: string): boolean {
  const operationTransformed = operation.trim().toLowerCase();
  const versionResolved = version ? parseOpenApiVersion({ openapi: version }) : undefined;
  const allowedOperations = new Set(
    versionResolved
    ? OPENAPI_VERSIONS[versionResolved.family]?.allowedOperations || []
    : Object.values(OPENAPI_VERSIONS).flat().map(_ => _.allowedOperations).flat()
  );
  return allowedOperations.has(operationTransformed);
}
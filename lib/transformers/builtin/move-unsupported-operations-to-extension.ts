import { createOperationTransformer } from '../operation.transformer';
import { parseOpenApiVersion } from '../../utils/version.utils';
import { EXTENSIONS, OPENAPI_VERSIONS } from '../../openapi.constants';

export const MoveUnsupportedOperationsToExtension = createOperationTransformer({
  transform: (context) => {

    // parse document version
    const version = OPENAPI_VERSIONS[parseOpenApiVersion(context.document).family];

    // skip if version is not supported
    if (!version) {
      return;
    }

    // move custom operations to extension
    if(!version.allowedOperations.includes(context.operation)){
      context.pathObject[EXTENSIONS.ADDITIONAL_OPERATIONS] ??= {};
      context.pathObject[EXTENSIONS.ADDITIONAL_OPERATIONS][context.operation.trim().toUpperCase()] = context.operationObject;
      delete context.pathObject[context.operation];
    }

  }
})
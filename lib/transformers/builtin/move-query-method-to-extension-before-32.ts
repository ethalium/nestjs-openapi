import { createOperationTransformer } from '../operation.transformer';
import { parseOpenApiVersion } from '../../utils/version.utils';
import { EXTENSIONS, OPENAPI_VERSIONS } from '../../openapi.constants';

export const MoveQueryMethodToExtensionBefore32 = createOperationTransformer({
  transform: (context) => {

    // parse document version
    const version = OPENAPI_VERSIONS[parseOpenApiVersion(context.document).family];

    // skip if version is not supported
    if (!version) {
      return;
    }

    // move custom methods to extension
    if(!version.allowedMethods.includes(context.method)){
      context.pathObject[EXTENSIONS.ADDITIONAL_OPERATIONS] ??= {};
      context.pathObject[EXTENSIONS.ADDITIONAL_OPERATIONS][context.method.trim().toUpperCase()] = context.operationObject;
      delete context.pathObject[context.method];
    }

  }
})
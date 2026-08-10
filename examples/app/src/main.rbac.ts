import { applyDecorators, SetMetadata } from '@nestjs/common';
import { createOperationExtensionTransformer, OAExtension } from '../../../lib';

const RbacExtension = 'x-rbac-permissions';

export function RbacRequires(...permissions: Array<string|string[]>): ClassDecorator & MethodDecorator {
  const perms = permissions.flat();
  return applyDecorators(
    SetMetadata(RbacExtension, perms),
    OAExtension(RbacExtension, perms),
  );
}

export const RbacTransformer = createOperationExtensionTransformer({
  extension: RbacExtension,
  transform: (context) => {
    const permissions = Array.from(new Set([context.propertiesFromController, context.propertiesFromMethod].flat().filter(Boolean)));
    if(permissions.length){
      context.operationObject.description = [
        context.operationObject.description,
        [
          '#### Required Permissions',
          '---',
          permissions.map(_ => "`" + _ + "`").join(' ')
        ],
      ].flat().filter(Boolean).join('\n\n');
    }
  }
});
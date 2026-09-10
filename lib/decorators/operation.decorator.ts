import { createDecorator } from '../utils/decorator.utils';
import { ApiOperation, ApiOperationOptions } from '@nestjs/swagger';
import { IOpenApiDecoratorOptions } from '../interfaces/common.interface';
import { DECORATORS } from '../openapi.constants';

export function OAOperation(options: ApiOperationOptions, decoratorOptions?: IOpenApiDecoratorOptions): MethodDecorator {
  return createDecorator<ApiOperationOptions, ApiOperationOptions>({
    decorators: (options, store) => {

      // get current operation
      let operation = DECORATORS.SWAGGER.OPERATION.get(...options.decorateArgs);

      // transform operation based on decoratorOptions
      switch(decoratorOptions?.overrideStrategy ?? 'merge') {
        case 'merge': {
          operation = { ...operation || {}, ...options.data };
          break;
        }
        case 'replace': {
          operation = options.data;
          break;
        }
        case false: {
          break;
        }
      }

      // add @ApiOperation
      store.push(ApiOperation(operation || {}));

    },
  })(options) as any;
}
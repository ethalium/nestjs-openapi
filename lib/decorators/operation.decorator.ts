import { createDecorator } from '../utils/decorator.utils';
import { ApiOperationOptions } from '@nestjs/swagger';
import { IOpenApiDecoratorOptions } from '../interfaces/common.interface';
import { DECORATORS } from '../openapi.constants';

export function OAOperation(options: ApiOperationOptions, decoratorOptions?: IOpenApiDecoratorOptions): MethodDecorator {
  return createDecorator<ApiOperationOptions, ApiOperationOptions>({
    onApply: (options) => {

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

      // set operation
      DECORATORS.SWAGGER.OPERATION.set(operation || {}, ...options.decorateArgs);

    },
  })(options) as any;
}
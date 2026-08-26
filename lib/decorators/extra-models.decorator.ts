import { createDecorator } from '../utils/decorator.utils';
import { IOpenApiExtensionMetadata } from '../interfaces/extension.interface';
import { ApiExtraModels } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function OAExtraModels<TProperties = any>(...models: Type[]): ClassDecorator & MethodDecorator {
  return createDecorator<void, IOpenApiExtensionMetadata>({
    decorators: (ctx, store) => {
      store.push(ApiExtraModels(...models));
    },
  })() as ClassDecorator & MethodDecorator;
}
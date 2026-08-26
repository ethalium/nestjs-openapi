import { createDecorator } from '../utils/decorator.utils';
import { IOpenApiExtensionKey, IOpenApiExtensionMetadata } from '../interfaces/extension.interface';
import { ApiExtension } from '@nestjs/swagger';
import { DECORATORS, STORES } from '../openapi.constants';

export function OAExtension<TProperties = any>(metadata: IOpenApiExtensionMetadata<TProperties>): ClassDecorator & MethodDecorator & PropertyDecorator;
export function OAExtension<TProperties = any>(key: IOpenApiExtensionKey, properties?: TProperties): ClassDecorator & MethodDecorator & PropertyDecorator;
export function OAExtension(keyOrMetadata: IOpenApiExtensionKey|IOpenApiExtensionMetadata, properties?: any): ClassDecorator & MethodDecorator & PropertyDecorator {
  return createDecorator<void, IOpenApiExtensionMetadata>({
    transform: () => {
      if (typeof keyOrMetadata === 'string') {
        return { key: keyOrMetadata, properties };
      }
      return keyOrMetadata;
    },
    decorators: (ctx, store) => {
      store.push(ApiExtension(ctx.data.key, ctx.data.properties));
    },
    onApply: (ctx) => {
      DECORATORS.OPENAPI.EXTENSIONS.set(ctx.data.key, ctx.data, ...ctx.decorateArgs);
      if(ctx.kind === 'property' && ctx.propertyKey){
        const currentType = STORES.MODEL_PROPERTIES_EXTENSIONS.get(ctx.classType) || {};
        const currentProperty = currentType[ctx.propertyKey] || {};
        STORES.MODEL_PROPERTIES_EXTENSIONS.set(ctx.classType, {
          ...currentType,
          [ctx.propertyKey!]: {
            ...currentProperty,
            [ctx.data.key]: ctx,
          }
        });
      }
    }
  })() as ClassDecorator & MethodDecorator;
}
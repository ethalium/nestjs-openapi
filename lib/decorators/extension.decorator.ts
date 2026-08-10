import { createDecorator } from '../utils/decorator.utils';
import { IOpenApiExtensionKey, IOpenApiExtensionMetadata } from '../interfaces/extension.interface';
import { ApiExtension } from '@nestjs/swagger';
import { DECORATORS } from '../constants/metadata.constants';

export function OAExtension<TProperties = any>(metadata: IOpenApiExtensionMetadata<TProperties>): ClassDecorator & MethodDecorator;
export function OAExtension<TProperties = any>(key: IOpenApiExtensionKey, properties?: TProperties): ClassDecorator & MethodDecorator;
export function OAExtension(keyOrMetadata: IOpenApiExtensionKey|IOpenApiExtensionMetadata, properties?: any): ClassDecorator & MethodDecorator {
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
    }
  })() as ClassDecorator & MethodDecorator;
}
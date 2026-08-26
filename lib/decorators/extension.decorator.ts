import { createDecorator } from '../utils/decorator.utils';
import { IOpenApiExtensionKey, IOpenApiExtensionMetadata } from '../interfaces/extension.interface';
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
    onApply: (ctx) => {
      DECORATORS.SWAGGER.EXTENSIONS.set(ctx.data.key, ctx.data.properties, ...ctx.decorateArgs);
      if (ctx.kind === 'property') {
        STORES.MODELS.push(ctx.classType);
      }
    }
  })() as ClassDecorator & MethodDecorator & PropertyDecorator;
}
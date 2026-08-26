import { AllDecorator, createDecorator } from '../utils/decorator.utils';
import { ApiExtension } from '@nestjs/swagger';
import { IOpenApiOriginMetadata } from '../interfaces/origin.interface';
import { DECORATORS, EXTENSIONS, STORES } from '../openapi.constants';

let counter = 0;

/** @internal */
export function OAOrigin(kind: string): AllDecorator {
  return createDecorator<void, IOpenApiOriginMetadata|null>({
    transform: (opts) => ({
      ...opts,
      id: ++counter,
    }),
    decorators: (ctx, store) => {
      if(!ctx.data) return;
      DECORATORS.SWAGGER.EXTENSIONS.set(EXTENSIONS.ORIGIN_KIND(kind), ctx.data.id, ...ctx.decorateArgs);
    },
    onApply: (ctx) => {
      if(!ctx.data) return;
      STORES.ORIGINS.set(ctx.data.id, ctx.data);
    }
  })() as AllDecorator;
}
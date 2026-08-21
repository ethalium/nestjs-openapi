import { AllDecorator, createDecorator } from '../utils/decorator.utils';
import { ApiExtension } from '@nestjs/swagger';
import { IOpenApiOriginMetadata } from '../interfaces/origin.interface';
import { EXTENSIONS, STORES } from '../openapi.constants';

let counter = 0;

/** @internal */
export function OAOrigin(): AllDecorator {
  return createDecorator<void, IOpenApiOriginMetadata|null>({
    transform: (opts) => ({
      ...opts,
      id: ++counter,
    }),
    decorators: (ctx, store) => {
      if(!ctx.data) return;
      store.push(ApiExtension(EXTENSIONS.ORIGIN_KIND(ctx.kind), ctx.data.id));
    },
    onApply: (ctx) => {
      if(!ctx.data) return;
      STORES.ORIGINS.set(ctx.data.id, ctx.data);
    }
  })() as AllDecorator;
}
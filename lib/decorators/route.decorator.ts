import { createDecorator } from '../utils/decorator.utils';
import type { IOpenApiRouteLike } from '../interfaces/common.interface';
import { extractFalse, extractObject, extractRoute } from '../utils/type.utils';
import { RequestMapping, RequestMethod } from '@nestjs/common';
import type { IOpenApiRouteOptions } from '../interfaces/route.interface';
import { OACreatedResponse, OAOkResponse } from './response.decorator';
import { OABody } from './body.decorator';
import { OARequest } from './request.decorator';
import { OAOrigin } from './origin.decorator';
import { OAOperation } from './operation.decorator';

export function OARoute(method: RequestMethod, path: IOpenApiRouteLike, options?: Omit<IOpenApiRouteOptions, 'path'> | false): MethodDecorator;
export function OARoute(method: RequestMethod, options?: IOpenApiRouteOptions): MethodDecorator;
export function OARoute(method: RequestMethod, ...args: any[]): MethodDecorator {
  return createDecorator<any[], IOpenApiRouteOptions>({
    transform: (opts) => Object.assign(
      { path: extractRoute(opts.data) || '' },
      extractObject(opts.data) || {},
      extractFalse(opts.data) ? { exclude: true } : {}
    ),
    decorators: (options, store) => {

      // add @RequestMapping decorator
      store.push(RequestMapping({
        method: method,
        path: options.data.path,
      }));

      // add @OAOrigin decorator
      store.push(OAOrigin('route'));

      // add @OARequest decorator
      store.push(OARequest('route', options.data));

      // add operation
      store.push(OAOperation({
        summary: options.data.summary,
        description: options.data.description,
        operationId: options.data.operationId,
        externalDocs: options.data.externalDocs,
        deprecated: options.data.deprecated,
        security: options.data.security,
        servers: options.data.servers
      }, { overrideStrategy: options?.data?.overrideStrategy }));

      // add body
      if(options.data.body){
        store.push(OABody(options.data.body as any));
      }

      // add response
      if(options.data.response){
        switch(method){
          case RequestMethod.POST: {
            store.push(OACreatedResponse(options.data.response as any));
            break;
          }
          default: {
            store.push(OAOkResponse(options.data.response as any));
          }
        }
      }

    },
  })(args) as any;
}
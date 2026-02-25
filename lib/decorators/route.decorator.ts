import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiRouteLike} from "../interfaces/common.interface";
import {extractFalse, extractObject, extractRoute} from "../utils/type.utils";
import {RequestMapping, RequestMethod} from "@nestjs/common";
import {IOpenApiRouteOptions} from "../interfaces/route.interface";
import {OACreatedResponse, OAOkResponse} from "./response.decorator";
import {OABody} from "./body.decorator";
import {OARequest} from "./request.decorator";
import {ApiOperation} from "@nestjs/swagger";


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

      // add @Controller decorator
      store.push(RequestMapping({
        method: method,
        path: options.data.path,
      }));

      // add @OARequest decorator
      store.push(OARequest('route', options.data));

      // add operation
      if([options.data.summary, options.data.description, options.data.operationId, options.data.externalDocs].filter(Boolean).length > 0){
        store.push(ApiOperation({
          summary: options.data.summary,
          description: options.data.description,
          operationId: options.data.operationId,
          externalDocs: options.data.externalDocs,
        }));
      }

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
import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiControllerOptions} from "../interfaces/controller.interface";
import {IOpenApiRouteLike} from "../interfaces/common.interface";
import {extractFalse, extractObject, extractRoute} from "../utils/type.utils";
import {Controller} from "@nestjs/common";
import {OARequest} from "./request.decorator";

export function OAController(path: IOpenApiRouteLike, options?: Omit<IOpenApiControllerOptions, 'path'> | false): ClassDecorator;
export function OAController(options?: IOpenApiControllerOptions): ClassDecorator;
export function OAController(...args: any[]): ClassDecorator {
  return createDecorator<any[], IOpenApiControllerOptions>({
    transform: (opts) => Object.assign(
      { path: extractRoute(opts.data) || '' },
      extractObject(opts.data) || {},
      extractFalse(opts.data) ? { exclude: true } : {}
    ),
    decorators: (options, store) => {

      // add @Controller decorator
      store.push(Controller({
        path: options.data.path,
        host: options.data.host,
        scope: options.data.scope,
        durable: options.data.durable,
        version: options.data.version,
      }));

      // add @OARequest decorator
      store.push(OARequest('controller', options.data));

    },
  })(args) as ClassDecorator;
}
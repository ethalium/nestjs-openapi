import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiType} from "../interfaces/common.interface";
import {extractAndResolveClassRef, extractObject} from "../utils/type.utils";
import {ApiBody} from "@nestjs/swagger";
import {IOpenApiBodyOptions} from "../interfaces/body.interface";

export function OABody(options: IOpenApiBodyOptions) : ClassDecorator & MethodDecorator;
export function OABody(type: IOpenApiType, options?: Omit<IOpenApiBodyOptions, 'type'>) : ClassDecorator & MethodDecorator;
export function OABody(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiBodyOptions>({
    transform: (opts) => Object.assign(
      { type: extractAndResolveClassRef(opts.data) },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiBody(opts.data as any));
    },
  })(args) as ClassDecorator & MethodDecorator;
}
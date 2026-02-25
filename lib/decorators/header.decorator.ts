import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiTagMetadata} from "../interfaces/common.interface";
import {extractObject, extractString} from "../utils/type.utils";
import {IOpenApiHeaderMetadata, IOpenApiHeaderOptions} from "../interfaces/header.interface";
import {ApiHeader} from "@nestjs/swagger";

export function OAHeaders(params: IOpenApiHeaderOptions) : ClassDecorator & MethodDecorator {
  return createDecorator<IOpenApiHeaderOptions, IOpenApiHeaderMetadata[]>({
    transform: (opts) => Object.entries(opts.data).map(([param, metadata]) => ({ name: param, ...metadata })),
    decorators: (opts, store) => opts.data.map(param => store.push(OAHeader(param)))
  })(params) as ClassDecorator & MethodDecorator;
}

export function OAHeader(options: IOpenApiHeaderMetadata) : ClassDecorator & MethodDecorator;
export function OAHeader(name: string, options?: Omit<IOpenApiHeaderMetadata, 'name'>) : ClassDecorator & MethodDecorator;
export function OAHeader(name: string, description?: string, options?: Omit<IOpenApiHeaderMetadata, 'name'|'description'>) : ClassDecorator & MethodDecorator;
export function OAHeader(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiTagMetadata>({
    transform: (opts) => Object.assign(
      { name: extractString(opts.data) },
      { description: extractString(opts.data, 1) },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiHeader(opts.data));
    },
  })(args) as ClassDecorator & MethodDecorator;
}
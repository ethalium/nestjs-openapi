import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiTagMetadata} from "../interfaces/common.interface";
import {extractObject, extractString} from "../utils/type.utils";
import {IOpenApiQueryMetadata, IOpenApiQueryOptions} from "../interfaces/query.interface";
import {ApiQuery} from "@nestjs/swagger";

export function OAQueries(params: IOpenApiQueryOptions) : ClassDecorator & MethodDecorator {
  return createDecorator<IOpenApiQueryOptions, IOpenApiQueryMetadata[]>({
    transform: (opts) => Object.entries(opts.data).map(([param, metadata]) => ({ name: param, ...metadata })),
    decorators: (opts, store) => opts.data.map(param => store.push(OAQuery(param)))
  })(params) as ClassDecorator & MethodDecorator;
}

export function OAQuery(options: IOpenApiQueryMetadata) : ClassDecorator & MethodDecorator;
export function OAQuery(name: string, options?: Omit<IOpenApiQueryMetadata, 'name'>) : ClassDecorator & MethodDecorator;
export function OAQuery(name: string, description?: string, options?: Omit<IOpenApiQueryMetadata, 'name'|'description'>) : ClassDecorator & MethodDecorator;
export function OAQuery(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiTagMetadata>({
    transform: (opts) => Object.assign(
      { name: extractString(opts.data) },
      { description: extractString(opts.data, 1) },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiQuery(opts.data));
    },
  })(args) as ClassDecorator & MethodDecorator;
}
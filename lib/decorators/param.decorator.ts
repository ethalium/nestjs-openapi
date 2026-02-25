import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiTagMetadata} from "../interfaces/common.interface";
import {extractObject, extractString} from "../utils/type.utils";
import {IOpenApiParamMetadata, IOpenApiParamOptions} from "../interfaces/param.interface";
import {ApiParam} from "@nestjs/swagger";

export function OAParams(params: IOpenApiParamOptions) : ClassDecorator & MethodDecorator {
  return createDecorator<IOpenApiParamOptions, IOpenApiParamMetadata[]>({
    transform: (opts) => Object.entries(opts.data).map(([param, metadata]) => ({ name: param, ...metadata })),
    decorators: (opts, store) => opts.data.map(param => store.push(OAParam(param)))
  })(params) as ClassDecorator & MethodDecorator;
}

export function OAParam(options: IOpenApiParamMetadata) : ClassDecorator & MethodDecorator;
export function OAParam(name: string, options?: Omit<IOpenApiParamMetadata, 'name'>) : ClassDecorator & MethodDecorator;
export function OAParam(name: string, description?: string, options?: Omit<IOpenApiParamMetadata, 'name'|'description'>) : ClassDecorator & MethodDecorator;
export function OAParam(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiTagMetadata>({
    transform: (opts) => Object.assign(
      { name: extractString(opts.data) },
      { description: extractString(opts.data, 1) },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiParam(opts.data));
    },
  })(args) as ClassDecorator & MethodDecorator;
}
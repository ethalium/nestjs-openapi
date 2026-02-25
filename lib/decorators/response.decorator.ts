import {IOpenApiResponseOptions, IOpenApiResponseType} from "../interfaces/common.interface";
import {createDecorator} from "../utils/decorator.utils";
import {extractAndResolveClassRef, extractObject} from "../utils/type.utils";
import {ApiResponse} from "@nestjs/swagger";
import {HttpStatus} from "@nestjs/common";


export function OAResponse(options: IOpenApiResponseOptions) : ClassDecorator & MethodDecorator;
export function OAResponse(type: IOpenApiResponseType, options?: Omit<IOpenApiResponseOptions, 'type'>) : ClassDecorator & MethodDecorator;
export function OAResponse(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiResponseOptions>({
    transform: (opts) => Object.assign(
      { type: extractAndResolveClassRef(opts.data) },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiResponse(opts.data as any));
    },
  })(args) as ClassDecorator & MethodDecorator;
}

export function OAOkResponse(options: Omit<IOpenApiResponseOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OAOkResponse(type: IOpenApiResponseType, options?: Omit<IOpenApiResponseOptions, 'status'|'type'>) : ClassDecorator & MethodDecorator;
export function OAOkResponse(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiResponseOptions>({
    transform: (opts) => Object.assign(
      { type: extractAndResolveClassRef(opts.data) },
      { status: HttpStatus.OK },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiResponse(opts.data as any));
    },
  })(args) as ClassDecorator & MethodDecorator;
}

export function OACreatedResponse(options: Omit<IOpenApiResponseOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OACreatedResponse(type: IOpenApiResponseType, options?: Omit<IOpenApiResponseOptions, 'status'|'type'>) : ClassDecorator & MethodDecorator;
export function OACreatedResponse(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiResponseOptions>({
    transform: (opts) => Object.assign(
      { type: extractAndResolveClassRef(opts.data) },
      { status: HttpStatus.CREATED },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiResponse(opts.data as any));
    },
  })(args) as ClassDecorator & MethodDecorator;
}
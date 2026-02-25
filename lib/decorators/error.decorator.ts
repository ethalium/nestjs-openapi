import {HttpStatus} from "@nestjs/common";
import {IOpenApiErrorOptions, IOpenApiErrorType} from "../interfaces/common.interface";
import {createDecorator} from "../utils/decorator.utils";
import {extractAndResolveClassRef, extractObject, extractString} from "../utils/type.utils";
import {ApiResponse} from "@nestjs/swagger";

export function OAError(status: HttpStatus|number, options?: Omit<IOpenApiErrorOptions, 'status'>): ClassDecorator & MethodDecorator;
export function OAError(status: HttpStatus|number, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>): ClassDecorator & MethodDecorator;
export function OAError(status: HttpStatus|number, type?: IOpenApiErrorType, options?: Omit<IOpenApiErrorOptions, 'status'|'type'>): ClassDecorator & MethodDecorator;
export function OAError(status: HttpStatus|number, type?: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>): ClassDecorator & MethodDecorator;
export function OAError(status: HttpStatus|number, ...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiErrorOptions>({
    transform: (ctx) => Object.assign(
      { status: status },
      { description: extractString(ctx.data) },
      { type: extractAndResolveClassRef(ctx.data) },
      extractObject(ctx.data) || {},
    ),
    decorators: (ctx, store) => {
      store.push(ApiResponse(ctx.data as any));
    }
  })(args) as any;
}
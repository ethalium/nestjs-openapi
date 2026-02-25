import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";
import {OAError} from "../error.decorator";
import {HttpStatus} from "@nestjs/common";

export function OANotImplemented(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OANotImplemented(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OANotImplemented(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OANotImplemented(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.NOT_IMPLEMENTED, ...args);
}
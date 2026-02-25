import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";
import {OAError} from "../error.decorator";
import {HttpStatus} from "@nestjs/common";

export function OAMethodNotAllowed(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OAMethodNotAllowed(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OAMethodNotAllowed(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OAMethodNotAllowed(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.METHOD_NOT_ALLOWED, ...args);
}
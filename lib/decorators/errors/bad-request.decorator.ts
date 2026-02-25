import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";
import {OAError} from "../error.decorator";
import {HttpStatus} from "@nestjs/common";


export function OABadRequest(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OABadRequest(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OABadRequest(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OABadRequest(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.BAD_REQUEST, ...args);
}
import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";
import {HttpStatus} from "@nestjs/common";
import {OAError} from "../error.decorator";


export function OAForbidden(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OAForbidden(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OAForbidden(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OAForbidden(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.FORBIDDEN, ...args);
}
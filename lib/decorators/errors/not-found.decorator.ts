import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";
import {OAError} from "../error.decorator";
import {extractObject} from "../../utils/type.utils";
import {HttpStatus} from "@nestjs/common";

export function OANotFound(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OANotFound(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OANotFound(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OANotFound(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.NOT_FOUND, ...args);
}
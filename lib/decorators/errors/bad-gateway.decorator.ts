import {HttpStatus} from "@nestjs/common";
import {OAError} from "../error.decorator";
import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";

export function OABadGateway(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OABadGateway(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OABadGateway(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OABadGateway(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.BAD_GATEWAY, ...args);
}
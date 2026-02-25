import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";
import {OAError} from "../error.decorator";
import {HttpStatus} from "@nestjs/common";

export function OAPreconditionFailed(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OAPreconditionFailed(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OAPreconditionFailed(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OAPreconditionFailed(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.PRECONDITION_FAILED, ...args);
}
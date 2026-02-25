import {IOpenApiErrorOptions, IOpenApiErrorType} from "../../interfaces/common.interface";
import {OAError} from "../error.decorator";
import {HttpStatus} from "@nestjs/common";

export function OAPayloadTooLarge(options?: Omit<IOpenApiErrorOptions, 'status'>) : ClassDecorator & MethodDecorator;
export function OAPayloadTooLarge(description: string, options?: Omit<IOpenApiErrorOptions, 'status'|'description'>) : ClassDecorator & MethodDecorator;
export function OAPayloadTooLarge(error: IOpenApiErrorType, description?: string, options?: Omit<IOpenApiErrorOptions, 'status'|'type'|'description'>) : ClassDecorator & MethodDecorator;
export function OAPayloadTooLarge(...args: any[]) : ClassDecorator & MethodDecorator {
  return OAError(HttpStatus.PAYLOAD_TOO_LARGE, ...args);
}
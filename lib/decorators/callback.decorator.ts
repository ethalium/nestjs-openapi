import { IOpenApiCallbackObject } from '../interfaces/callback.interface';
import { applyDecorators } from '@nestjs/common';
import { ApiCallbacks } from '@nestjs/swagger';

export function OACallbacks<TRequestBodyType = any>(...callbackObject: IOpenApiCallbackObject<TRequestBodyType>[]): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiCallbacks(...callbackObject));
}
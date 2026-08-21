import type { IOpenApiRouteLike } from '../../interfaces/common.interface';
import type { IOpenApiRouteOptions } from '../../interfaces/route.interface';
import { OARoute } from '../route.decorator';
import { RequestMethod } from '@nestjs/common';

export function OAQueryMethod(path: IOpenApiRouteLike, options?: Omit<IOpenApiRouteOptions, 'path'> | false): MethodDecorator;
export function OAQueryMethod(options?: IOpenApiRouteOptions): MethodDecorator;
export function OAQueryMethod(...args: any[]): MethodDecorator {
  return OARoute(RequestMethod.QUERY, ...args);
}
import {IOpenApiRouteLike} from "../../interfaces/common.interface";
import {IOpenApiRouteOptions} from "../../interfaces/route.interface";
import {OARoute} from "../route.decorator";
import {RequestMethod} from "@nestjs/common";

export function OAPatch(path: IOpenApiRouteLike, options?: Omit<IOpenApiRouteOptions, 'path'> | false): MethodDecorator;
export function OAPatch(options?: IOpenApiRouteOptions): MethodDecorator;
export function OAPatch(...args: any[]): MethodDecorator {
  return OARoute(RequestMethod.PATCH, ...args);
}
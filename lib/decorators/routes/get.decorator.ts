import {IOpenApiRouteLike} from "../../interfaces/common.interface";
import {IOpenApiRouteOptions} from "../../interfaces/route.interface";
import {OARoute} from "../route.decorator";
import {RequestMethod} from "@nestjs/common";

export function OAGet(path: IOpenApiRouteLike, options?: Omit<IOpenApiRouteOptions, 'path'> | false): MethodDecorator;
export function OAGet(options?: IOpenApiRouteOptions): MethodDecorator;
export function OAGet(...args: any[]): MethodDecorator {
  return OARoute(RequestMethod.GET, ...args);
}
import {IOpenApiRouteLike} from "../../interfaces/common.interface";
import {IOpenApiRouteOptions} from "../../interfaces/route.interface";
import {OARoute} from "../route.decorator";
import {RequestMethod} from "@nestjs/common";

export function OADelete(path: IOpenApiRouteLike, options?: Omit<IOpenApiRouteOptions, 'path'> | false): MethodDecorator;
export function OADelete(options?: IOpenApiRouteOptions): MethodDecorator;
export function OADelete(...args: any[]): MethodDecorator {
  return OARoute(RequestMethod.DELETE, ...args);
}
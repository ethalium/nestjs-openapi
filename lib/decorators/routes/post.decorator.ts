import {IOpenApiRouteLike} from "../../interfaces/common.interface";
import {IOpenApiRouteOptions} from "../../interfaces/route.interface";
import {OARoute} from "../route.decorator";
import {RequestMethod} from "@nestjs/common";

export function OAPost(path: IOpenApiRouteLike, options?: Omit<IOpenApiRouteOptions, 'path'> | false): MethodDecorator;
export function OAPost(options?: IOpenApiRouteOptions): MethodDecorator;
export function OAPost(...args: any[]): MethodDecorator {
  return OARoute(RequestMethod.POST, ...args);
}
import {IOpenApiRouteLike} from "../../interfaces/common.interface";
import {IOpenApiRouteOptions} from "../../interfaces/route.interface";
import {OARoute} from "../route.decorator";
import {RequestMethod} from "@nestjs/common";

export function OAPut(path: IOpenApiRouteLike, options?: Omit<IOpenApiRouteOptions, 'path'> | false): MethodDecorator;
export function OAPut(options?: IOpenApiRouteOptions): MethodDecorator;
export function OAPut(...args: any[]): MethodDecorator {
  return OARoute(RequestMethod.PUT, ...args);
}
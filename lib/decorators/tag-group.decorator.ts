import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiTagGroupMetadata} from "../interfaces/common.interface";
import {extractObject, extractString} from "../utils/type.utils";
import {DECORATORS} from "../constants/metadata.constants";

/**
 * Creates and applies a decorator for OpenAPI Tag Group metadata, which organizes API endpoints under a specific tag group.
 * @location Module | Controller | Route
 *
 * @param {IOpenApiTagGroupMetadata} options - Metadata options for the OpenAPI tag group configuration.
 * @return {ClassDecorator & MethodDecorator} A decorator to be used on classes or methods for grouping API tags.
 */
export function OATagGroup(options: IOpenApiTagGroupMetadata) : ClassDecorator & MethodDecorator;
export function OATagGroup(name: string, options?: Omit<IOpenApiTagGroupMetadata, 'name'>) : ClassDecorator & MethodDecorator;
export function OATagGroup(name: string, description?: string, options?: Omit<IOpenApiTagGroupMetadata, 'name'|'description'>) : ClassDecorator & MethodDecorator;
export function OATagGroup(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiTagGroupMetadata>({
    transform: (ctx) => Object.assign(
      { name: extractString(ctx.data) },
      { description: extractString(ctx.data, 1) },
      extractObject(ctx.data) || {}
    ),
    onApply: (ctx) => {
      DECORATORS.OPENAPI.TAG_GROUPS.set(ctx.data, ...ctx.decorateArgs);
    }
  })(args) as ClassDecorator & MethodDecorator;
}
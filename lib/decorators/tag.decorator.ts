import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiTagMetadata} from "../interfaces/common.interface";
import {extractObject, extractString} from "../utils/type.utils";
import {DECORATORS} from "../constants/metadata.constants";
import {ApiTags} from "@nestjs/swagger";

export function OATags(...tags: Array<string|IOpenApiTagMetadata>) : ClassDecorator & MethodDecorator {
  return createDecorator<Array<string|IOpenApiTagMetadata>, IOpenApiTagMetadata[]>({
    transform: (ctx) => ctx.data.map(tag => typeof tag === 'string' ? { name: tag } : tag),
    decorators: (ctx, store) => ctx.data.map(tag => store.push(OATag(tag)))
  })(tags) as ClassDecorator & MethodDecorator;
}

export function OATag(options: IOpenApiTagMetadata) : ClassDecorator & MethodDecorator;
export function OATag(name: string, options?: Omit<IOpenApiTagMetadata, 'name'>) : ClassDecorator & MethodDecorator;
export function OATag(name: string, description?: string, options?: Omit<IOpenApiTagMetadata, 'name'|'description'>) : ClassDecorator & MethodDecorator;
export function OATag(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiTagMetadata>({
    transform: (ctx) => Object.assign(
      { name: extractString(ctx.data) },
      { description: extractString(ctx.data, 1) },
      extractObject(ctx.data) || {}
    ),
    decorators: (ctx, store) => {
      store.push(ApiTags(ctx.data.name));
    },
    onApply: (ctx) => {
      DECORATORS.OPENAPI.TAGS.add(ctx.data, ...ctx.decorateArgs);
    }
  })(args) as ClassDecorator & MethodDecorator;
}
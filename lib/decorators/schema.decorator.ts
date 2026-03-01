import {createDecorator} from "../utils/decorator.utils";
import {IOpenApiType} from "../interfaces/common.interface";
import {
  extractAndResolveClassRef,
  extractObject,
  extractString,
} from '../utils/type.utils';
import { ApiBody, ApiSchema } from '@nestjs/swagger';
import {IOpenApiBodyOptions} from "../interfaces/body.interface";
import { IOpenApiSchemaOptions } from '../interfaces/schema.interface';

export function OASchema(options: IOpenApiSchemaOptions) : ClassDecorator & MethodDecorator;
export function OASchema(name?: string, options?: Omit<IOpenApiSchemaOptions, 'name'>) : ClassDecorator & MethodDecorator;
export function OASchema(name: string, description?: string, options?: Omit<IOpenApiSchemaOptions, 'name'|'description'>) : ClassDecorator & MethodDecorator;
export function OASchema(...args: any[]): ClassDecorator & MethodDecorator {
  return createDecorator<any[], IOpenApiSchemaOptions>({
    transform: (opts) => Object.assign(
      { name: extractString(opts.data) },
      { description: extractString(opts.data, 1) },
      extractObject(opts.data) || {}
    ),
    decorators: (opts, store) => {
      store.push(ApiSchema(opts.data as any));
    },
  })(args) as ClassDecorator & MethodDecorator;
}
import {createPropertyDecorator} from "../utils/decorator.utils";
import {IOpenApiPropertyOptions} from "../interfaces/property.interface";
import {extractObject, extractString} from "../utils/type.utils";
import {ApiProperty} from "@nestjs/swagger";

export function OAProperty(options: IOpenApiPropertyOptions): PropertyDecorator {
  return OACreateProperty({
    args: [options]
  });
}

/** @internal */
export function OACreateProperty(data: {
  args: any[];
  options?: IOpenApiPropertyOptions;
  tap?: (options: IOpenApiPropertyOptions, decorators: PropertyDecorator[]) => void;
}): PropertyDecorator {
  return createPropertyDecorator<any[], IOpenApiPropertyOptions>({
    transform: (ctx) => {
      const options = Object.assign(extractObject<IOpenApiPropertyOptions>(ctx.data) || {}, data.options || {});
      options.description = options.description || extractString(ctx.data) || undefined;
      return options;
    },
    decorators: (ctx, store) => {
      data.tap?.(ctx.data, store as any[]);
      store.push(ApiProperty(ctx.data));
    }
  })(data.args);
}
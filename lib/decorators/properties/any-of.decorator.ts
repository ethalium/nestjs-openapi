import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {IOpenApiTypeRefSingle} from "../../interfaces/common.interface";
import {AnyDecorator} from "../../utils/decorator.utils";
import {ApiExtraModels} from "@nestjs/swagger";
import {OACreateProperty} from "../property.decorator";
import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {createSchemaRefs} from "../../utils/schema.utils";

export type IOpenApiAnyOfPropertyOptions = Omit<IOpenApiPropertyOptions, 'type'|'oneOf'|'allOf'|'anyOf'>;

export function OAAnyOfProperty(anyOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options?: IOpenApiAnyOfPropertyOptions) : PropertyDecorator;
export function OAAnyOfProperty(anyOf: Array<IOpenApiTypeRefSingle|SchemaObject>, description?: string, options?: Omit<IOpenApiAnyOfPropertyOptions, 'description'>) : PropertyDecorator;
export function OAAnyOfProperty(anyOf: Array<IOpenApiTypeRefSingle|SchemaObject>, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options, decorators) => tap(anyOf, options, decorators),
  });
}

export function OAAnyOfPropertyOptional(anyOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options?: Omit<IOpenApiAnyOfPropertyOptions, 'required'>) : PropertyDecorator;
export function OAAnyOfPropertyOptional(anyOf: Array<IOpenApiTypeRefSingle|SchemaObject>, description?: string, options?: Omit<IOpenApiAnyOfPropertyOptions, 'required'|'description'>) : PropertyDecorator;
export function OAAnyOfPropertyOptional(anyOf: Array<IOpenApiTypeRefSingle|SchemaObject>, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options, decorators) => tap(anyOf, options, decorators),
    options: {
      required: false
    }
  });
}

function tap(anyOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options: IOpenApiPropertyOptions, decorators: AnyDecorator[]): void {
  options.anyOf = createSchemaRefs(anyOf, {
    onClassRef: (ref) => decorators.push(ApiExtraModels(ref)),
  })
}
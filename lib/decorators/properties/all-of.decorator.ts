import {IOpenApiTypeRefSingle} from "../../interfaces/common.interface";
import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {AnyDecorator} from "../../utils/decorator.utils";
import {ApiExtraModels} from "@nestjs/swagger";
import {OACreateProperty} from "../property.decorator";
import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {createSchemaRefs} from "../../utils/schema.utils";

export type IOpenApiAllOfPropertyOptions = Omit<IOpenApiPropertyOptions, 'type'|'oneOf'|'allOf'|'anyOf'>;

export function OAAllOfProperty(allOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options?: IOpenApiAllOfPropertyOptions) : PropertyDecorator;
export function OAAllOfProperty(allOf: Array<IOpenApiTypeRefSingle|SchemaObject>, description?: string, options?: Omit<IOpenApiAllOfPropertyOptions, 'description'>) : PropertyDecorator;
export function OAAllOfProperty(allOf: Array<IOpenApiTypeRefSingle|SchemaObject>, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options, decorators) => tap(allOf, options, decorators),
  });
}

export function OAAllOfPropertyOptional(allOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options?: Omit<IOpenApiAllOfPropertyOptions, 'required'>) : PropertyDecorator;
export function OAAllOfPropertyOptional(allOf: Array<IOpenApiTypeRefSingle|SchemaObject>, description?: string, options?: Omit<IOpenApiAllOfPropertyOptions, 'required'|'description'>) : PropertyDecorator;
export function OAAllOfPropertyOptional(allOf: Array<IOpenApiTypeRefSingle|SchemaObject>, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options, decorators) => tap(allOf, options, decorators),
    options: {
      required: false
    }
  });
}

function tap(allOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options: IOpenApiPropertyOptions, decorators: AnyDecorator[]): void {
  options.allOf = createSchemaRefs(allOf, {
    onClassRef: (ref) => decorators.push(ApiExtraModels(ref)),
  })
}
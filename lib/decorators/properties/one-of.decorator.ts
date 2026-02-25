import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {IOpenApiTypeRefSingle} from "../../interfaces/common.interface";
import {AnyDecorator} from "../../utils/decorator.utils";
import {ApiExtraModels} from "@nestjs/swagger";
import {OACreateProperty} from "../property.decorator";
import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {createSchemaRefs} from "../../utils/schema.utils";

export type IOpenApiOneOfPropertyOptions = Omit<IOpenApiPropertyOptions, 'type'|'oneOf'|'allOf'|'anyOf'>;

export function OAOneOfProperty(oneOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options?: IOpenApiOneOfPropertyOptions) : PropertyDecorator;
export function OAOneOfProperty(oneOf: Array<IOpenApiTypeRefSingle|SchemaObject>, description?: string, options?: Omit<IOpenApiOneOfPropertyOptions, 'description'>) : PropertyDecorator;
export function OAOneOfProperty(oneOf: Array<IOpenApiTypeRefSingle|SchemaObject>, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options, decorators) => tap(oneOf, options, decorators),
  });
}

export function OAOneOfPropertyOptional(oneOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options?: Omit<IOpenApiOneOfPropertyOptions, 'required'>) : PropertyDecorator;
export function OAOneOfPropertyOptional(oneOf: Array<IOpenApiTypeRefSingle|SchemaObject>, description?: string, options?: Omit<IOpenApiOneOfPropertyOptions, 'required'|'description'>) : PropertyDecorator;
export function OAOneOfPropertyOptional(oneOf: Array<IOpenApiTypeRefSingle|SchemaObject>, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options, decorators) => tap(oneOf, options, decorators),
    options: {
      required: false
    }
  });
}

function tap(oneOf: Array<IOpenApiTypeRefSingle|SchemaObject>, options: IOpenApiPropertyOptions, decorators: AnyDecorator[]): void {
  options.oneOf = createSchemaRefs(oneOf, {
    onClassRef: (ref) => decorators.push(ApiExtraModels(ref)),
  })
}
import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {EnumAllowedTypes} from "@nestjs/swagger/dist/interfaces/schema-object-metadata.interface";
import {OACreateProperty} from "../property.decorator";

export function OAEnumProperty(enumRef: EnumAllowedTypes, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'>) : PropertyDecorator;
export function OAEnumProperty(enumRef: EnumAllowedTypes, description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'|'description'>) : PropertyDecorator;
export function OAEnumProperty(enumRef: EnumAllowedTypes, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options) => formatOptions(enumRef, options),
  });
}

export function OAEnumPropertyOptional(enumRef: EnumAllowedTypes, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'|'required'>) : PropertyDecorator;
export function OAEnumPropertyOptional(enumRef: EnumAllowedTypes, description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'|'required'|'description'>) : PropertyDecorator;
export function OAEnumPropertyOptional(enumRef: EnumAllowedTypes, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options) => formatOptions(enumRef, options),
    options: {
      required: false,
    }
  });
}

function formatOptions(enumRef: EnumAllowedTypes, options: IOpenApiPropertyOptions): void {
  options.enum = enumRef;
}
import type { IOpenApiPropertyOptions } from '../../interfaces/property.interface';
import { OACreateProperty } from '../property.decorator';
import { IOpenApiAllowedEnumTypes } from '../../interfaces/common.interface';

export function OAEnumProperty(enumRef: IOpenApiAllowedEnumTypes, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'>) : PropertyDecorator;
export function OAEnumProperty(enumRef: IOpenApiAllowedEnumTypes, description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'|'description'>) : PropertyDecorator;
export function OAEnumProperty(enumRef: IOpenApiAllowedEnumTypes, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options) => formatOptions(enumRef, options),
  });
}

export function OAEnumPropertyOptional(enumRef: IOpenApiAllowedEnumTypes, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'|'required'>) : PropertyDecorator;
export function OAEnumPropertyOptional(enumRef: IOpenApiAllowedEnumTypes, description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'enum'|'required'|'description'>) : PropertyDecorator;
export function OAEnumPropertyOptional(enumRef: IOpenApiAllowedEnumTypes, ...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    tap: (options) => formatOptions(enumRef, options),
    options: {
      required: false,
    }
  });
}

function formatOptions(enumRef: IOpenApiAllowedEnumTypes, options: IOpenApiPropertyOptions): void {
  options.enum = enumRef;
}
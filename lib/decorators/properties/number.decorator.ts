import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {OACreateProperty} from "../property.decorator";

export function OANumberProperty(options?: Omit<IOpenApiPropertyOptions, 'type'>) : PropertyDecorator;
export function OANumberProperty(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'description'>) : PropertyDecorator;
export function OANumberProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'number',
    }
  });
}

export function OANumberPropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OANumberPropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OANumberPropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'number',
      required: false,
    }
  });
}
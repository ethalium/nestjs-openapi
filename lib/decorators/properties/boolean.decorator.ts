import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {OACreateProperty} from "../property.decorator";

export function OABooleanProperty(options?: Omit<IOpenApiPropertyOptions, 'type'>) : PropertyDecorator;
export function OABooleanProperty(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'description'>) : PropertyDecorator;
export function OABooleanProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'boolean',
    }
  });
}

export function OABooleanPropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OABooleanPropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OABooleanPropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'boolean',
      required: false,
    }
  });
}
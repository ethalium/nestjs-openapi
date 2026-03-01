import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {OACreateProperty} from "../property.decorator";

export function OADateProperty(options?: Omit<IOpenApiPropertyOptions, 'type'>) : PropertyDecorator;
export function OADateProperty(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'description'>) : PropertyDecorator;
export function OADateProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'string',
      format: 'date',
    },
  });
}

export function OADatePropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OADatePropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OADatePropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'string',
      format: 'date',
      required: false,
    },
  });
}
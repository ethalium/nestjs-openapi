import {IOpenApiPropertyOptions} from "../../interfaces/property.interface";
import {OACreateProperty} from "../property.decorator";

export function OADatetimeProperty(options?: Omit<IOpenApiPropertyOptions, 'type'>) : PropertyDecorator;
export function OADatetimeProperty(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'description'>) : PropertyDecorator;
export function OADatetimeProperty(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'string',
      format: 'date-time',
    }
  });
}

export function OADatetimePropertyOptional(options?: Omit<IOpenApiPropertyOptions, 'type'|'required'>) : PropertyDecorator;
export function OADatetimePropertyOptional(description?: string, options?: Omit<IOpenApiPropertyOptions, 'type'|'required'|'description'>) : PropertyDecorator;
export function OADatetimePropertyOptional(...args: any[]): PropertyDecorator {
  return OACreateProperty({
    args: args,
    options: {
      type: 'string',
      format: 'date-time',
      required: false,
    }
  });
}